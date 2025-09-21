// pizzaria_app.ts
import * as path from 'path';
import { promises as fs } from 'fs';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

/* ---------------------- Tipos ---------------------- */
type Tamanho = "Pequena" | "Média" | "Grande";
type FormaPagamento = "Dinheiro" | "Cartão" | "PIX";

interface PizzariaEntrada {
  idPedido: number;
  pedidoPizza: string;
  pedidoBebida: string;
  tamanhoPizza: Tamanho;
  quantidadePizza: number;
  bordaRecheada: boolean;
  quantidadeBebidas: number;
  sobremesa: string;
  quantidadeSobremesa: number;
  enderecoEntrega: string;
  cliente: string;
  telefone: string;
  horaPedido: string; // ISO string
  formaPagamento?: FormaPagamento;
}

/* ------------------- Pastas/Arquivos ---------------- */
const ROOT = path.resolve('.');
const DIR = {
  ts: path.join(ROOT, 'ts'),
  js: path.join(ROOT, 'js'),
  csv: path.join(ROOT, 'csv'),
  json: path.join(ROOT, 'json'),
};

const ARQ = {
  entradas: path.join(DIR.csv, 'entradas.csv'),
  ativos: path.join(DIR.csv, 'ativos.csv'),
  historico: path.join(DIR.csv, 'historico.csv'),
  config: path.join(DIR.json, 'config.json'),
  lastId: path.join(DIR.json, 'last_id.json'),
  sabores: path.join(DIR.json, 'sabores.json'),
  sobremesas: path.join(DIR.json, 'sobremesas.json'),
};

const CAB = {
  entradas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
  ativos: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
  historico: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento,horaSaida,precoTotal\n'
};

/* ------------------- Config padrão ------------------- */
interface PriceConfig {
  precoPorTamanho: { Pequena: number; "Média": number; Grande: number };
  precoBorda: number;
  precoBebida: number;
  precoSobremesa: { [key: string]: number };
}

const CONFIG_DEFAULT: PriceConfig = {
  precoPorTamanho: { Pequena: 30, "Média": 40, Grande: 50 },
  precoBorda: 5,
  precoBebida: 8,
  precoSobremesa: {
    "Pudim de leite condensado": 10,
    "Sorvete": 8,
    "Brigadeiro de colher": 6,
    "Brownie": 7,
    "Bolo de chocolate": 9
  }
};

const SABORES_DEFAULT = [
  "Margherita", "Calabresa", "Portuguesa", "Frango com Catupiry",
  "Quatro Queijos", "Vegetariana", "Pepperoni"
];

const SOBREMESAS_DEFAULT = [
  "Pudim de leite condensado",
  "Sorvete",
  "Brigadeiro de colher",
  "Brownie",
  "Bolo de chocolate"
];

/* -------------- Prepara ambiente (pastas/arquivos) -------------- */
async function preparaAmbiente(): Promise<void> {
  await fs.mkdir(DIR.ts, { recursive: true });
  await fs.mkdir(DIR.js, { recursive: true });
  await fs.mkdir(DIR.csv, { recursive: true });
  await fs.mkdir(DIR.json, { recursive: true });

  await criaSeNaoExiste(ARQ.entradas, CAB.entradas);
  await criaSeNaoExiste(ARQ.ativos, CAB.ativos);
  await criaSeNaoExiste(ARQ.historico, CAB.historico);

  try { await fs.access(ARQ.config); } catch { await fs.writeFile(ARQ.config, JSON.stringify(CONFIG_DEFAULT, null, 2), 'utf8'); }
  try { await fs.access(ARQ.lastId); } catch { await fs.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8'); }
  try { await fs.access(ARQ.sabores); } catch { await fs.writeFile(ARQ.sabores, JSON.stringify(SABORES_DEFAULT, null, 2), 'utf8'); }
  try { await fs.access(ARQ.sobremesas); } catch { await fs.writeFile(ARQ.sobremesas, JSON.stringify(SOBREMESAS_DEFAULT, null, 2), 'utf8'); }
}

async function criaSeNaoExiste(caminho: string, conteudo: string = ''): Promise<void> {
  try { await fs.access(caminho); } catch { await fs.writeFile(caminho, conteudo, 'utf8'); }
}

/* -------------------- Util CSV ---------------------- */
function csvSafe(s: string | number | boolean): string {
  const str = String(s ?? '');
  return (/,|"|\n/.test(str)) ? '"' + str.replace(/"/g, '""') + '"' : str;
}

function entradaToCsv(p: PizzariaEntrada & {horaSaida?: string, precoTotal?: number}): string {
  return [
    p.idPedido ?? '',
    p.cliente ?? '',
    p.telefone ?? '',
    p.pedidoPizza ?? '',
    p.pedidoBebida ?? '',
    p.tamanhoPizza ?? '',
    p.quantidadePizza ?? 0,
    p.bordaRecheada ?? false,
    p.quantidadeBebidas ?? 0,
    p.sobremesa ?? '',
    p.quantidadeSobremesa ?? 0,
    p.enderecoEntrega ?? '',
    p.horaPedido ?? '',
    p.formaPagamento ?? '',
    p.horaSaida ?? '',
    p.precoTotal != null ? p.precoTotal.toFixed(2) : ''
  ].map(csvSafe).join(',') + '\n';
}


function splitCsv(line: string): string[] {
  const result: string[] = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') { if (line[i+1]==='"'){ cur+='"'; i++; } else inQuotes=false; }
      else cur += ch;
    } else {
      if (ch === '"') inQuotes=true;
      else if (ch===',') { result.push(cur); cur=''; }
      else cur+=ch;
    }
  }
  result.push(cur);
  return result;
}

/* --------------- Helpers: ID e Config -------------------- */
async function getNextId(): Promise<number> {
  const raw = await fs.readFile(ARQ.lastId, 'utf8');
  const obj = JSON.parse(raw) as { ultimoId?: number };
  const next = (obj.ultimoId || 0) + 1;
  await fs.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: next }, null, 2), 'utf8');
  return next;
}

async function loadConfig(): Promise<PriceConfig> {
  const raw = await fs.readFile(ARQ.config, 'utf8');
  return JSON.parse(raw) as PriceConfig;
}

async function loadSabores(): Promise<string[]> {
  const raw = await fs.readFile(ARQ.sabores, 'utf8');
  const arr = JSON.parse(raw) as string[];
  return Array.isArray(arr) ? arr : SABORES_DEFAULT;
}

async function loadSobremesas(): Promise<{ [key: string]: number }> {
  const config = await loadConfig();
  return config.precoSobremesa;
}

/* ------------------- Calcula total do pedido ------------------- */
async function calcularPrecoTotal(dados: {
  tamanhoPizza: Tamanho;
  quantidadePizza: number;
  bordaRecheada: boolean;
  quantidadeBebidas: number;
  sobremesa: string;
  quantidadeSobremesa: number;
}): Promise<number> {
  const config = await loadConfig();
  let total = 0;
  total += (config.precoPorTamanho[dados.tamanhoPizza] || 0) * dados.quantidadePizza;
  if(dados.bordaRecheada) total += config.precoBorda*dados.quantidadePizza;
  total += (dados.quantidadeBebidas || 0)*config.precoBebida;
  total += (dados.quantidadeSobremesa || 0)*(config.precoSobremesa[dados.sobremesa]||0);
  return total;
}

/* --------------- Repositório CSV -------------------- */
async function lerAtivos(): Promise<PizzariaEntrada[]> {
  try {
    const raw = await fs.readFile(ARQ.ativos,'utf8');
    const linhas = raw.split(/\r?\n/).filter(l=>l.trim().length>0);
    if(linhas.length<=1) return [];
    return linhas.slice(1).map(l=>{
      const [idPedido, cliente, telefone, pedidoPizza, pedidoBebida, tamanhoPizza, quantidadePizza, bordaRecheada, quantidadeBebidas, sobremesa, quantidadeSobremesa, enderecoEntrega, horaPedido, formaPagamento] = splitCsv(l);
      return {
        idPedido: Number(idPedido)||0,
        cliente, telefone, pedidoPizza, pedidoBebida,
        tamanhoPizza: tamanhoPizza as Tamanho,
        quantidadePizza: Number(quantidadePizza)||0,
        bordaRecheada: bordaRecheada.toLowerCase() === 'true',
        quantidadeBebidas: Number(quantidadeBebidas)||0,
        sobremesa,
        quantidadeSobremesa: Number(quantidadeSobremesa)||0,
        enderecoEntrega,
        horaPedido,
        formaPagamento: formaPagamento as FormaPagamento
      } as PizzariaEntrada;
    });
  } catch { return []; }
}

async function escreverAtivos(lista: PizzariaEntrada[]): Promise<void> {
  const corpo = lista.map(entradaToCsv).join('');
  await fs.writeFile(ARQ.ativos, CAB.ativos+corpo, 'utf8');
}

async function registrarEntrada(dados: Omit<PizzariaEntrada,'idPedido'|'horaPedido'>): Promise<PizzariaEntrada>{
  const id = await getNextId();
  const reg:PizzariaEntrada = {idPedido:id, horaPedido:new Date().toISOString(), ...dados};
  await fs.appendFile(ARQ.ativos, entradaToCsv(reg),'utf8');
  return reg;
}

/* ------------------- Finalizar Pedido e Histórico ------------------- */
async function finalizarPedido(pedido: PizzariaEntrada, precoTotal: number){
  const horaSaida = new Date().toISOString();
  await fs.appendFile(ARQ.historico, entradaToCsv({...pedido,horaSaida,precoTotal}),'utf8');
  const ativos = await lerAtivos();
  const novosAtivos = ativos.filter(p=>p.idPedido!==pedido.idPedido);
  await escreverAtivos(novosAtivos);
}

/* ------------------- Emissão de Comprovante ------------------- */
async function emitirComprovante(pedido: PizzariaEntrada, total: number){
  const dateISO = new Date().toISOString().slice(0,10);
  const caminho = path.join(DIR.csv, `comprovante_${pedido.idPedido}_${dateISO}.txt`);
  const conteudo = `
=== COMPROVANTE DE COMPRA ===
ID Pedido: ${pedido.idPedido}
Cliente: ${pedido.cliente}
Telefone: ${pedido.telefone}
Endereço: ${pedido.enderecoEntrega}

Pizza: ${pedido.pedidoPizza} (${pedido.tamanhoPizza}) x${pedido.quantidadePizza} ${pedido.bordaRecheada?'Borda Recheada':''}
Bebida: ${pedido.pedidoBebida} x${pedido.quantidadeBebidas}
Sobremesa: ${pedido.sobremesa} x${pedido.quantidadeSobremesa}

Forma de Pagamento: ${pedido.formaPagamento}

Hora do Pedido: ${pedido.horaPedido}
Valor Total: R$ ${total.toFixed(2)}

Obrigado pela preferência!
`;
  await fs.writeFile(caminho, conteudo,'utf8');
  console.log(`Comprovante gerado: ${caminho}`);
}

/* ------------------- Relatórios de Vendas ------------------- */
async function relatorioVendas(){
  try{
    const raw = await fs.readFile(ARQ.historico,'utf8');
    const linhas = raw.split(/\r?\n/).filter(l=>l.trim().length>1).slice(1);

    const vendasDiarias:{[forma:string]:{[data:string]:{qtd:number,total:number}}} = {};
    const vendasMensais:{[forma:string]:{[mes:string]:{qtd:number,total:number}}} = {};

    linhas.forEach(l=>{
      const campos = splitCsv(l);
      const qtd = Number(campos[6])||0;
      const total = Number(campos[16])||0;
      const forma = campos[13]||'Não definido';
      const data = campos[12].slice(0,10);
      const mes = campos[12].slice(0,7);

      if(!vendasDiarias[forma]) vendasDiarias[forma]={};
      if(!vendasMensais[forma]) vendasMensais[forma]={};

      if(!vendasDiarias[forma][data]) vendasDiarias[forma][data]={qtd:0,total:0};
      if(!vendasMensais[forma][mes]) vendasMensais[forma][mes]={qtd:0,total:0};

      vendasDiarias[forma][data].qtd += qtd;
      vendasDiarias[forma][data].total += total;

      vendasMensais[forma][mes].qtd += qtd;
      vendasMensais[forma][mes].total += total;
    });

    console.log('\n=== RELATÓRIO DIÁRIO DE PIZZAS VENDIDAS ===');
    for(const forma in vendasDiarias){
      for(const dia in vendasDiarias[forma]){
        console.log(`${forma}: ${vendasDiarias[forma][dia].qtd} pizzas | Total: R$ ${vendasDiarias[forma][dia].total.toFixed(2)}`);
      }
    }

    console.log('\n=== RELATÓRIO MENSAL DE PIZZAS VENDIDAS ===');
    for(const forma in vendasMensais){
      for(const mes in vendasMensais[forma]){
        console.log(`${forma}: ${vendasMensais[forma][mes].qtd} pizzas | Total: R$ ${vendasMensais[forma][mes].total.toFixed(2)}`);
      }
    }

  } catch { console.log('Sem histórico de vendas.'); }
}

/* ------------------- UI ------------------- */
const rl = readline.createInterface({input,output});
function ask(q:string):Promise<string>{return new Promise(resolve=>rl.question(q,resolve));}

async function mostrarCardapio():Promise<void>{
  const sabores = await loadSabores();
  const config = await loadConfig();
  const sobremesas = await loadSobremesas();

  console.log('\n=== CARDÁPIO DE PIZZAS ===');
  sabores.forEach((s,i)=>console.log(`${i+1}) ${s}`));

  console.log('\n=== PREÇOS POR TAMANHO ===');
  console.log(`Pequena: R$ ${config.precoPorTamanho.Pequena}`);
  console.log(`Média:   R$ ${config.precoPorTamanho["Média"]}`);
  console.log(`Grande:  R$ ${config.precoPorTamanho.Grande}`);
  console.log(`\nBorda Recheada: R$ ${config.precoBorda}`);
  console.log(`Bebida (unitário): R$ ${config.precoBebida}`);

  console.log('\n=== SOBREMESAS ===');
  Object.entries(sobremesas).forEach(([s,preco])=>console.log(`${s} - R$ ${preco}`));
}

/* --------------------- Main ------------------------ */
async function main():Promise<void>{
  await preparaAmbiente();
  console.log('=== Pizzaria App ===');

  process.on('SIGINT',async()=>{ console.log('\nEncerrando...'); rl.close(); process.exit(); });

  let sair=false;
  while(!sair){
    console.log('\n=== MENU ===');
    console.log('1 - Registrar pedido');
    console.log('2 - Listar pedidos ativos com total por cliente');
    console.log('3 - Finalizar pedido');
    console.log('4 - Limpar pedidos ativos e reiniciar ID');
    console.log('5 - Relatório de vendas (diário/mensal)');
    console.log('0 - Sair');

    const opc=await ask('> ');

    switch(opc){
      case '1':{
        await mostrarCardapio();
        const cliente = await ask('Cliente: ');
        const telefone = await ask('Telefone: ');
        const pizza = await ask('Pizza: ');
        const bebida = await ask('Bebida: ');
        const tamanho = (await ask('Tamanho (Pequena/Média/Grande): ')) as Tamanho;
        const qtdPizza = Number(await ask('Qtde pizzas: '))||1;
        const borda = (await ask('Borda recheada (s/n): ')).toLowerCase()==='s';
        const qtdBebida = Number(await ask('Qtde bebidas: '))||0;
        const sobremesas = await loadSobremesas();
        const sobremesa = await ask('Escolha a sobremesa: ');
        const qtdSobremesa = Number(await ask('Qtde sobremesas: '))||0;
        const endereco = await ask('Endereço: ');
        const formaPagamento = (await ask('Forma de pagamento (Dinheiro/Cartão/PIX): ')) as FormaPagamento;

const reg = await registrarEntrada({
  cliente, telefone, pedidoPizza: pizza, pedidoBebida: bebida,
  tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
  quantidadeBebidas: qtdBebida, sobremesa, quantidadeSobremesa: qtdSobremesa,
  enderecoEntrega: endereco, formaPagamento
});


        const total = await calcularPrecoTotal({
          tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
          quantidadeBebidas: qtdBebida, sobremesa, quantidadeSobremesa: qtdSobremesa
        });

        console.log(`Pedido registrado com ID ${reg.idPedido} | Valor total: R$ ${total.toFixed(2)}`);
        await emitirComprovante(reg,total);
        break;
      }
      case '2':{
        const ativos = await lerAtivos();
        if(ativos.length===0){ console.log('Nenhum pedido ativo.'); break; }
        console.log('\n=== PEDIDOS ATIVOS COM TOTAL POR CLIENTE ===');
        const pedidosPorCliente:{[cliente:string]:PizzariaEntrada[]}={};
        for(const p of ativos){ if(!pedidosPorCliente[p.cliente]) pedidosPorCliente[p.cliente]=[]; pedidosPorCliente[p.cliente].push(p); }

        for(const cliente in pedidosPorCliente){
          const listaPedidos = pedidosPorCliente[cliente];
          let totalCliente=0;
          console.log(`\nCliente: ${cliente} | Telefone: ${listaPedidos[0].telefone}`);
          for(const p of listaPedidos){
            const totalPedido = await calcularPrecoTotal({
              tamanhoPizza: p.tamanhoPizza,
              quantidadePizza: p.quantidadePizza,
              bordaRecheada: p.bordaRecheada,
              quantidadeBebidas: p.quantidadeBebidas,
              sobremesa: p.sobremesa,
              quantidadeSobremesa: p.quantidadeSobremesa
            });
            totalCliente += totalPedido;
            console.log(`  Pedido ID ${p.idPedido}: Pizza: ${p.pedidoPizza} (${p.tamanhoPizza}) x${p.quantidadePizza}, Bebida: ${p.pedidoBebida} x${p.quantidadeBebidas}, Sobremesa: ${p.sobremesa} x${p.quantidadeSobremesa}, Forma: ${p.formaPagamento} | Total: R$ ${totalPedido.toFixed(2)}`);
          }
          console.log(`  Total acumulado do cliente: R$ ${totalCliente.toFixed(2)}`);
        }
        break;
      }
      case '3':{
        const id = Number(await ask('Digite o ID do pedido a finalizar: '));
        const ativos = await lerAtivos();
        const pedido = ativos.find(p=>p.idPedido===id);
        if(!pedido){ console.log('Pedido não encontrado'); break; }
        const total = await calcularPrecoTotal({
          tamanhoPizza: pedido.tamanhoPizza,
          quantidadePizza: pedido.quantidadePizza,
          bordaRecheada: pedido.bordaRecheada,
          quantidadeBebidas: pedido.quantidadeBebidas,
          sobremesa: pedido.sobremesa,
          quantidadeSobremesa: pedido.quantidadeSobremesa
        });
        await finalizarPedido(pedido,total);
        console.log(`Pedido ${id} finalizado e registrado no histórico.`);
        break;
      }
      case '4':{
        const confirm = (await ask('Tem certeza que deseja limpar TODOS os pedidos ativos? (s/n): ')).toLowerCase();
        if(confirm==='s'){
          await fs.writeFile(ARQ.ativos,CAB.ativos,'utf8');
          await fs.writeFile(ARQ.lastId,JSON.stringify({ultimoId:0},null,2),'utf8');
          console.log('Lista de pedidos ativos limpa e ID reiniciado.');
        } else console.log('Operação cancelada.');
        break;
      }
      case '5': await relatorioVendas(); break;
      case '0': sair=true; console.log('Encerrando aplicação...'); break;
      default: console.log('Opção inválida!'); break;
    }
  }
  rl.close();
}

main().catch(console.error);

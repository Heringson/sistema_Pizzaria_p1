"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// pizzaria_app.ts
const path = __importStar(require("path"));
const fs_1 = require("fs");
const readline = __importStar(require("readline"));
const process_1 = require("process");
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
    saidas: path.join(DIR.csv, 'saidas.csv'),
    resumoTxtPrefix: path.join(DIR.csv, 'resumo_diario'),
    config: path.join(DIR.json, 'config.json'),
    lastId: path.join(DIR.json, 'last_id.json'),
    sabores: path.join(DIR.json, 'sabores.json'),
};
const CAB = {
    entradas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,enderecoEntrega,horaPedido\n',
    ativos: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,enderecoEntrega,horaPedido\n',
    saidas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,enderecoEntrega,horaPedido,horaSaida,metodoPagamento,precoTotal,status\n',
};
const CONFIG_DEFAULT = {
    precoPorTamanho: { Pequena: 30, "Média": 40, Grande: 50 },
    precoBorda: 5,
    precoBebida: 8,
};
const SABORES_DEFAULT = [
    "Margherita",
    "Calabresa",
    "Portuguesa",
    "Frango com Catupiry",
    "Quatro Queijos",
    "Vegetariana",
    "Pepperoni"
];
/* -------------- Prepara ambiente (pastas/arquivos) -------------- */
async function preparaAmbiente() {
    await fs_1.promises.mkdir(DIR.ts, { recursive: true });
    await fs_1.promises.mkdir(DIR.js, { recursive: true });
    await fs_1.promises.mkdir(DIR.csv, { recursive: true });
    await fs_1.promises.mkdir(DIR.json, { recursive: true });
    await criaSeNaoExiste(ARQ.entradas, CAB.entradas);
    await criaSeNaoExiste(ARQ.ativos, CAB.ativos);
    await criaSeNaoExiste(ARQ.saidas, CAB.saidas);
    try {
        await fs_1.promises.access(ARQ.config);
    }
    catch {
        await fs_1.promises.writeFile(ARQ.config, JSON.stringify(CONFIG_DEFAULT, null, 2), 'utf8');
    }
    try {
        await fs_1.promises.access(ARQ.lastId);
    }
    catch {
        await fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8');
    }
    try {
        await fs_1.promises.access(ARQ.sabores);
    }
    catch {
        await fs_1.promises.writeFile(ARQ.sabores, JSON.stringify(SABORES_DEFAULT, null, 2), 'utf8');
    }
}
async function criaSeNaoExiste(caminho, conteudo = '') {
    try {
        await fs_1.promises.access(caminho);
    }
    catch {
        await fs_1.promises.writeFile(caminho, conteudo, 'utf8');
    }
}
/* -------------------- Util CSV ---------------------- */
function csvSafe(s) {
    return (/,|"|\n/.test(s)) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function entradaToCsv(p) {
    return [
        String(p.idPedido),
        p.cliente,
        p.telefone,
        p.pedidoPizza,
        p.pedidoBebida,
        p.tamanhoPizza,
        String(p.quantidadePizza),
        String(p.bordaRecheada),
        String(p.quantidadeBebidas),
        p.enderecoEntrega,
        p.horaPedido
    ].map(csvSafe).join(',') + '\n';
}
function saidaToCsv(s) {
    return [
        String(s.idPedido),
        s.cliente,
        s.telefone,
        s.pedidoPizza,
        s.pedidoBebida,
        s.tamanhoPizza,
        String(s.quantidadePizza),
        String(s.bordaRecheada),
        String(s.quantidadeBebidas),
        s.enderecoEntrega,
        s.horaPedido,
        s.horaSaida,
        s.metodoPagamento,
        String(s.precoTotal),
        s.status
    ].map(csvSafe).join(',') + '\n';
}
// Split CSV robusto
function splitCsv(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') {
                    cur += '"';
                    i++;
                }
                else
                    inQuotes = false;
            }
            else
                cur += ch;
        }
        else {
            if (ch === '"')
                inQuotes = true;
            else if (ch === ',') {
                result.push(cur);
                cur = '';
            }
            else
                cur += ch;
        }
    }
    result.push(cur);
    return result;
}
/* --------------- Helpers: ID e Config -------------------- */
async function getNextId() {
    const raw = await fs_1.promises.readFile(ARQ.lastId, 'utf8');
    const obj = JSON.parse(raw);
    const next = (obj.ultimoId || 0) + 1;
    await fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: next }, null, 2), 'utf8');
    return next;
}
async function loadConfig() {
    const raw = await fs_1.promises.readFile(ARQ.config, 'utf8');
    return JSON.parse(raw);
}
async function loadSabores() {
    const raw = await fs_1.promises.readFile(ARQ.sabores, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : SABORES_DEFAULT;
}
/* --------------- Repositório CSV -------------------- */
async function lerAtivos() {
    try {
        const raw = await fs_1.promises.readFile(ARQ.ativos, 'utf8');
        const linhas = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (linhas.length <= 1)
            return [];
        return linhas.slice(1).map(l => {
            const [idPedido, cliente, telefone, pedidoPizza, pedidoBebida, tamanhoPizza, quantidadePizza, bordaRecheada, quantidadeBebidas, enderecoEntrega, horaPedido] = splitCsv(l);
            return {
                idPedido: Number(idPedido) || 0,
                cliente, telefone, pedidoPizza, pedidoBebida,
                tamanhoPizza: tamanhoPizza,
                quantidadePizza: Number(quantidadePizza) || 0,
                bordaRecheada: bordaRecheada.toLowerCase() === 'true',
                quantidadeBebidas: Number(quantidadeBebidas) || 0,
                enderecoEntrega,
                horaPedido
            };
        });
    }
    catch {
        return [];
    }
}
async function escreverAtivos(lista) {
    const corpo = lista.map(entradaToCsv).join('');
    await fs_1.promises.writeFile(ARQ.ativos, CAB.ativos + corpo, 'utf8');
}
/* ------------------- Casos de uso ------------------- */
async function registrarEntrada(dados) {
    const id = await getNextId();
    const reg = { idPedido: id, ...dados, horaPedido: new Date().toISOString() };
    await fs_1.promises.appendFile(ARQ.entradas, entradaToCsv(reg), 'utf8');
    await fs_1.promises.appendFile(ARQ.ativos, entradaToCsv(reg), 'utf8');
    const dateISO = new Date().toISOString().slice(0, 10);
    await fs_1.promises.appendFile(ARQ.resumoTxtPrefix + `_${dateISO}.txt`, `${reg.horaPedido} | PEDIDO ${reg.idPedido} | ${reg.cliente} | ${reg.pedidoPizza} (${reg.tamanhoPizza}) x${reg.quantidadePizza}\n`, 'utf8');
    return reg;
}
// ... Restante do código (registrarSaidaPedido, consultas, exportações, menu) segue o mesmo padrão de parse CSV seguro e Number(...) || 0
/* ------------------- UI ------------------- */
const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
function ask(q) { return new Promise(resolve => rl.question(q, resolve)); }
function imprimeAtivo(p) {
    console.log(`ID: ${p.idPedido} | Cliente: ${p.cliente} | Pizza: ${p.pedidoPizza} (${p.tamanhoPizza}) | Qtde: ${p.quantidadePizza}`);
}
function imprimeSaida(s) {
    console.log(`ID: ${s.idPedido} | Cliente: ${s.cliente} | Total: R$ ${s.precoTotal.toFixed(2)} | Status: ${s.status}`);
}
/* --------------------- Main ------------------------ */
async function main() {
    await preparaAmbiente();
    process.on('SIGINT', async () => { console.log('\nEncerrando e exportando resumo do dia...'); rl.close(); process.exit(); });
    console.log('=== Pizzaria App ===');
    // Menu simplificado (exemplo)
    let sair = false;
    while (!sair) {
        console.log('\n1- Registrar pedido | 2- Listar ativos | 0- Sair');
        const opc = await ask('> ');
        switch (opc) {
            case '1':
                const cliente = await ask('Cliente: ');
                const telefone = await ask('Telefone: ');
                const pizza = await ask('Pizza: ');
                const bebida = await ask('Bebida: ');
                const tamanho = (await ask('Tamanho (Pequena/Média/Grande): '));
                const qtdPizza = Number(await ask('Qtde pizzas: ')) || 1;
                const borda = (await ask('Borda recheada (s/n): ')).toLowerCase() === 's';
                const qtdBebida = Number(await ask('Qtde bebidas: ')) || 0;
                const endereco = await ask('Endereço: ');
                const reg = await registrarEntrada({ cliente, telefone, pedidoPizza: pizza, pedidoBebida: bebida, tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda, quantidadeBebidas: qtdBebida, enderecoEntrega: endereco });
                console.log('Pedido registrado com ID', reg.idPedido);
                break;
            case '2':
                const ativos = await lerAtivos();
                ativos.forEach(imprimeAtivo);
                break;
            case '0':
                sair = true;
                break;
            default:
                console.log('Opção inválida');
                break;
        }
    }
    rl.close();
}
main().catch(console.error);

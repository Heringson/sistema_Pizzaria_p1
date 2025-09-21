"use strict";
// pizzaria_app.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var readline = require("readline");
var process_1 = require("process");
/* ------------------- Pastas/Arquivos ---------------- */
var ROOT = path.resolve('.');
var DIR = {
    ts: path.join(ROOT, 'ts'),
    js: path.join(ROOT, 'js'),
    csv: path.join(ROOT, 'csv'),
    json: path.join(ROOT, 'json'),
};
var ARQ = {
    entradas: path.join(DIR.csv, 'entradas.csv'),
    ativos: path.join(DIR.csv, 'ativos.csv'),
    historico: path.join(DIR.csv, 'historico.csv'),
    config: path.join(DIR.json, 'config.json'),
    lastId: path.join(DIR.json, 'last_id.json'),
    sabores: path.join(DIR.json, 'sabores.json'),
    sobremesas: path.join(DIR.json, 'sobremesas.json'),
};
var CAB = {
    entradas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
    ativos: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
    historico: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento,horaSaida,precoTotal\n'
};
var CONFIG_DEFAULT = {
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
var SABORES_DEFAULT = [
    "Margherita", "Calabresa", "Portuguesa", "Frango com Catupiry",
    "Quatro Queijos", "Vegetariana", "Pepperoni"
];
var SOBREMESAS_DEFAULT = [
    "Pudim de leite condensado",
    "Sorvete",
    "Brigadeiro de colher",
    "Brownie",
    "Bolo de chocolate"
];
/* -------------- Prepara ambiente -------------- */
function preparaAmbiente() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fs_1.promises.mkdir(DIR.ts, { recursive: true })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.js, { recursive: true })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.csv, { recursive: true })];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.json, { recursive: true })];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.entradas, CAB.entradas)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.ativos, CAB.ativos)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.historico, CAB.historico)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 10, , 12]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.config)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 12];
                case 10:
                    _a = _e.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.config, JSON.stringify(CONFIG_DEFAULT, null, 2), 'utf8')];
                case 11:
                    _e.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _e.trys.push([12, 14, , 16]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.lastId)];
                case 13:
                    _e.sent();
                    return [3 /*break*/, 16];
                case 14:
                    _b = _e.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8')];
                case 15:
                    _e.sent();
                    return [3 /*break*/, 16];
                case 16:
                    _e.trys.push([16, 18, , 20]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.sabores)];
                case 17:
                    _e.sent();
                    return [3 /*break*/, 20];
                case 18:
                    _c = _e.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.sabores, JSON.stringify(SABORES_DEFAULT, null, 2), 'utf8')];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 20];
                case 20:
                    _e.trys.push([20, 22, , 24]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.sobremesas)];
                case 21:
                    _e.sent();
                    return [3 /*break*/, 24];
                case 22:
                    _d = _e.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.sobremesas, JSON.stringify(SOBREMESAS_DEFAULT, null, 2), 'utf8')];
                case 23:
                    _e.sent();
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/];
            }
        });
    });
}
function criaSeNaoExiste(caminho_1) {
    return __awaiter(this, arguments, void 0, function (caminho, conteudo) {
        var _a;
        if (conteudo === void 0) { conteudo = ''; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, fs_1.promises.access(caminho)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    _a = _b.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, conteudo, 'utf8')];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ------------------- CSV Helpers ------------------- */
function csvSafe(s) {
    var str = String(s !== null && s !== void 0 ? s : '');
    return (/,|"|\n/.test(str)) ? '"' + str.replace(/"/g, '""') + '"' : str;
}
function entradaToCsv(p) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return [
        (_a = p.idPedido) !== null && _a !== void 0 ? _a : '',
        (_b = p.cliente) !== null && _b !== void 0 ? _b : '',
        (_c = p.telefone) !== null && _c !== void 0 ? _c : '',
        (_d = p.pedidoPizza) !== null && _d !== void 0 ? _d : '',
        (_e = p.pedidoBebida) !== null && _e !== void 0 ? _e : '',
        (_f = p.tamanhoPizza) !== null && _f !== void 0 ? _f : '',
        (_g = p.quantidadePizza) !== null && _g !== void 0 ? _g : 0,
        (_h = p.bordaRecheada) !== null && _h !== void 0 ? _h : false,
        (_j = p.quantidadeBebidas) !== null && _j !== void 0 ? _j : 0,
        (_k = p.sobremesa) !== null && _k !== void 0 ? _k : '',
        (_l = p.quantidadeSobremesa) !== null && _l !== void 0 ? _l : 0,
        (_m = p.enderecoEntrega) !== null && _m !== void 0 ? _m : '',
        (_o = p.horaPedido) !== null && _o !== void 0 ? _o : '',
        (_p = p.formaPagamento) !== null && _p !== void 0 ? _p : '',
        (_q = p.horaSaida) !== null && _q !== void 0 ? _q : '',
        (_r = p.precoTotal) !== null && _r !== void 0 ? _r : ''
    ].map(csvSafe).join(',') + '\n';
}
function splitCsv(line) {
    var result = [];
    var cur = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
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
/* ------------------- ID e Config ------------------- */
function getNextId() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, obj, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.lastId, 'utf8')];
                case 1:
                    raw = _a.sent();
                    obj = JSON.parse(raw);
                    next = (obj.ultimoId || 0) + 1;
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: next }, null, 2), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, next];
            }
        });
    });
}
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.config, 'utf8')];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
function loadSabores() {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.sabores, 'utf8')];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
function loadSobremesas() {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadConfig()];
                case 1:
                    config = _a.sent();
                    return [2 /*return*/, config.precoSobremesa];
            }
        });
    });
}
/* ------------------- Calculo de preços ------------------- */
function calcularPrecoTotal(dados) {
    return __awaiter(this, void 0, void 0, function () {
        var config, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadConfig()];
                case 1:
                    config = _a.sent();
                    total = 0;
                    total += (config.precoPorTamanho[dados.tamanhoPizza] || 0) * dados.quantidadePizza;
                    if (dados.bordaRecheada)
                        total += config.precoBorda * dados.quantidadePizza;
                    total += (dados.quantidadeBebidas || 0) * config.precoBebida;
                    total += (dados.quantidadeSobremesa || 0) * (config.precoSobremesa[dados.sobremesa] || 0);
                    return [2 /*return*/, total];
            }
        });
    });
}
/* ------------------- Ler e escrever ativos ------------------- */
function lerAtivos() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, linhas, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.ativos, 'utf8')];
                case 1:
                    raw = _b.sent();
                    linhas = raw.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
                    if (linhas.length <= 1)
                        return [2 /*return*/, []];
                    return [2 /*return*/, linhas.slice(1).map(function (l) {
                            var _a = splitCsv(l), idPedido = _a[0], cliente = _a[1], telefone = _a[2], pedidoPizza = _a[3], pedidoBebida = _a[4], tamanhoPizza = _a[5], quantidadePizza = _a[6], bordaRecheada = _a[7], quantidadeBebidas = _a[8], sobremesa = _a[9], quantidadeSobremesa = _a[10], enderecoEntrega = _a[11], horaPedido = _a[12], formaPagamento = _a[13];
                            return {
                                idPedido: Number(idPedido) || 0,
                                cliente: cliente,
                                telefone: telefone,
                                pedidoPizza: pedidoPizza,
                                pedidoBebida: pedidoBebida,
                                tamanhoPizza: tamanhoPizza,
                                quantidadePizza: Number(quantidadePizza) || 0,
                                bordaRecheada: bordaRecheada.toLowerCase() === 'true',
                                quantidadeBebidas: Number(quantidadeBebidas) || 0,
                                sobremesa: sobremesa,
                                quantidadeSobremesa: Number(quantidadeSobremesa) || 0,
                                enderecoEntrega: enderecoEntrega,
                                horaPedido: horaPedido,
                                formaPagamento: formaPagamento
                            };
                        })];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function escreverAtivos(lista) {
    return __awaiter(this, void 0, void 0, function () {
        var corpo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    corpo = lista.map(entradaToCsv).join('');
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.ativos, CAB.ativos + corpo, 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function registrarEntrada(dados) {
    return __awaiter(this, void 0, void 0, function () {
        var id, reg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNextId()];
                case 1:
                    id = _a.sent();
                    reg = __assign({ idPedido: id, horaPedido: new Date().toISOString() }, dados);
                    return [4 /*yield*/, fs_1.promises.appendFile(ARQ.ativos, entradaToCsv(reg), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, reg];
            }
        });
    });
}
/* ------------------- Finalizar Pedido ------------------- */
function finalizarPedido(pedido, precoTotal) {
    return __awaiter(this, void 0, void 0, function () {
        var horaSaida, ativos, novosAtivos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    horaSaida = new Date().toISOString();
                    return [4 /*yield*/, fs_1.promises.appendFile(ARQ.historico, entradaToCsv(__assign(__assign({}, pedido), { horaSaida: horaSaida, precoTotal: precoTotal })), 'utf8')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, lerAtivos()];
                case 2:
                    ativos = _a.sent();
                    novosAtivos = ativos.filter(function (p) { return p.idPedido !== pedido.idPedido; });
                    return [4 /*yield*/, escreverAtivos(novosAtivos)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Comprovante ------------------- */
function emitirComprovante(pedido, total) {
    return __awaiter(this, void 0, void 0, function () {
        var dateISO, caminho, conteudo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dateISO = new Date().toISOString().slice(0, 10);
                    caminho = path.join(DIR.csv, "comprovante_".concat(pedido.idPedido, "_").concat(dateISO, ".txt"));
                    conteudo = "\n=== COMPROVANTE DE COMPRA ===\nID Pedido: ".concat(pedido.idPedido, "\nCliente: ").concat(pedido.cliente, "\nTelefone: ").concat(pedido.telefone, "\nEndere\u00E7o: ").concat(pedido.enderecoEntrega, "\n\nPizza: ").concat(pedido.pedidoPizza, " (").concat(pedido.tamanhoPizza, ") x").concat(pedido.quantidadePizza, " ").concat(pedido.bordaRecheada ? 'Borda Recheada' : '', "\nBebida: ").concat(pedido.pedidoBebida, " x").concat(pedido.quantidadeBebidas, "\nSobremesa: ").concat(pedido.sobremesa, " x").concat(pedido.quantidadeSobremesa, "\n\nForma de Pagamento: ").concat(pedido.formaPagamento, "\n\nHora do Pedido: ").concat(pedido.horaPedido, "\nValor Total: R$ ").concat(total.toFixed(2), "\n\nObrigado pela prefer\u00EAncia!\n");
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, conteudo, 'utf8')];
                case 1:
                    _a.sent();
                    console.log("Comprovante gerado: ".concat(caminho));
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Relatório ------------------- */
function relatorioVendas() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, linhas, vendasDiarias_1, vendasMensais_1, totalDiario_1, totalMensal_1, forma, forma, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.historico, 'utf8')];
                case 1:
                    raw = _a.sent();
                    linhas = raw.split(/\r?\n/).filter(function (l) { return l.trim().length > 1; }).slice(1);
                    if (linhas.length === 0) {
                        console.log('Sem histórico de vendas.');
                        return [2 /*return*/];
                    }
                    vendasDiarias_1 = {};
                    vendasMensais_1 = {};
                    totalDiario_1 = 0;
                    totalMensal_1 = 0;
                    linhas.forEach(function (l) {
                        var campos = splitCsv(l);
                        var qtd = Number(campos[6]) || 0; // quantidadePizza
                        var total = parseFloat(campos[15]) || 0; // precoTotal corrigido
                        var forma = campos[13] || 'Não definido'; // formaPagamento
                        var data = campos[12].slice(0, 10); // horaPedido
                        var mes = campos[12].slice(0, 7); // ano-mes
                        // Diárias
                        if (!vendasDiarias_1[forma])
                            vendasDiarias_1[forma] = { qtd: 0, total: 0 };
                        vendasDiarias_1[forma].qtd += qtd;
                        vendasDiarias_1[forma].total += total;
                        totalDiario_1 += total;
                        // Mensais
                        if (!vendasMensais_1[forma])
                            vendasMensais_1[forma] = { qtd: 0, total: 0 };
                        vendasMensais_1[forma].qtd += qtd;
                        vendasMensais_1[forma].total += total;
                        totalMensal_1 += total;
                    });
                    console.log('\n=== RELATÓRIO DIÁRIO DE PIZZAS VENDIDAS ===');
                    for (forma in vendasDiarias_1) {
                        console.log("".concat(forma, ": ").concat(vendasDiarias_1[forma].qtd, " pizzas | Total: R$ ").concat(vendasDiarias_1[forma].total.toFixed(2)));
                    }
                    console.log("TOTAL DI\u00C1RIO: R$ ".concat(totalDiario_1.toFixed(2)));
                    console.log('\n=== RELATÓRIO MENSAL DE PIZZAS VENDIDAS ===');
                    for (forma in vendasMensais_1) {
                        console.log("".concat(forma, ": ").concat(vendasMensais_1[forma].qtd, " pizzas | Total: R$ ").concat(vendasMensais_1[forma].total.toFixed(2)));
                    }
                    console.log("TOTAL MENSAL: R$ ".concat(totalMensal_1.toFixed(2)));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log('Erro ao gerar relatório:', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* ------------------- UI ------------------- */
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
function ask(q) { return new Promise(function (resolve) { return rl.question(q, resolve); }); }
function mostrarCardapio() {
    return __awaiter(this, void 0, void 0, function () {
        var sabores, config, sobremesas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadSabores()];
                case 1:
                    sabores = _a.sent();
                    return [4 /*yield*/, loadConfig()];
                case 2:
                    config = _a.sent();
                    return [4 /*yield*/, loadSobremesas()];
                case 3:
                    sobremesas = _a.sent();
                    console.log('\n=== CARDÁPIO DE PIZZAS ===');
                    sabores.forEach(function (s, i) { return console.log("".concat(i + 1, ") ").concat(s)); });
                    console.log('\n=== PREÇOS POR TAMANHO ===');
                    console.log("Pequena: R$ ".concat(config.precoPorTamanho.Pequena));
                    console.log("M\u00E9dia:   R$ ".concat(config.precoPorTamanho["Média"]));
                    console.log("Grande:  R$ ".concat(config.precoPorTamanho.Grande));
                    console.log("\nBorda Recheada: R$ ".concat(config.precoBorda));
                    console.log("Bebida (unit\u00E1rio): R$ ".concat(config.precoBebida));
                    console.log('\n=== SOBREMESAS ===');
                    Object.entries(sobremesas).forEach(function (_a) {
                        var s = _a[0], preco = _a[1];
                        return console.log("".concat(s, " - R$ ").concat(preco));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- MAIN ------------------- */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sair, _loop_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preparaAmbiente()];
                case 1:
                    _a.sent();
                    console.log('=== Pizzaria App ===');
                    process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        console.log('\nEncerrando...');
                        rl.close();
                        process.exit();
                        return [2 /*return*/];
                    }); }); });
                    sair = false;
                    _loop_1 = function () {
                        var opc, _b, cliente, telefone, pizza, bebida, tamanho, qtdPizza, _c, borda, qtdBebida, _d, sobremesas, sobremesa, qtdSobremesa, _e, endereco, formaPagamento, reg, total, ativos, _i, ativos_1, p, total, id_1, _f, ativos, pedido, total;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    console.log('\n=== MENU ===');
                                    console.log('1 - Registrar pedido');
                                    console.log('2 - Listar pedidos ativos com total por cliente');
                                    console.log('3 - Finalizar pedido');
                                    console.log('4 - Limpar pedidos ativos e reiniciar ID');
                                    console.log('5 - Relatório de vendas (diário/mensal)');
                                    console.log('0 - Sair');
                                    return [4 /*yield*/, ask('> ')];
                                case 1:
                                    opc = _g.sent();
                                    _b = opc;
                                    switch (_b) {
                                        case '1': return [3 /*break*/, 2];
                                        case '2': return [3 /*break*/, 20];
                                        case '3': return [3 /*break*/, 26];
                                        case '4': return [3 /*break*/, 31];
                                        case '5': return [3 /*break*/, 34];
                                        case '0': return [3 /*break*/, 36];
                                    }
                                    return [3 /*break*/, 37];
                                case 2: return [4 /*yield*/, mostrarCardapio()];
                                case 3:
                                    _g.sent();
                                    return [4 /*yield*/, ask('Cliente: ')];
                                case 4:
                                    cliente = _g.sent();
                                    return [4 /*yield*/, ask('Telefone: ')];
                                case 5:
                                    telefone = _g.sent();
                                    return [4 /*yield*/, ask('Pizza: ')];
                                case 6:
                                    pizza = _g.sent();
                                    return [4 /*yield*/, ask('Bebida: ')];
                                case 7:
                                    bebida = _g.sent();
                                    return [4 /*yield*/, ask('Tamanho (Pequena/Média/Grande): ')];
                                case 8:
                                    tamanho = (_g.sent());
                                    _c = Number;
                                    return [4 /*yield*/, ask('Qtde pizzas: ')];
                                case 9:
                                    qtdPizza = _c.apply(void 0, [_g.sent()]) || 1;
                                    return [4 /*yield*/, ask('Borda recheada (s/n): ')];
                                case 10:
                                    borda = (_g.sent()).toLowerCase() === 's';
                                    _d = Number;
                                    return [4 /*yield*/, ask('Qtde bebidas: ')];
                                case 11:
                                    qtdBebida = _d.apply(void 0, [_g.sent()]) || 0;
                                    return [4 /*yield*/, loadSobremesas()];
                                case 12:
                                    sobremesas = _g.sent();
                                    return [4 /*yield*/, ask('Escolha a sobremesa: ')];
                                case 13:
                                    sobremesa = _g.sent();
                                    _e = Number;
                                    return [4 /*yield*/, ask('Qtde sobremesas: ')];
                                case 14:
                                    qtdSobremesa = _e.apply(void 0, [_g.sent()]) || 0;
                                    return [4 /*yield*/, ask('Endereço: ')];
                                case 15:
                                    endereco = _g.sent();
                                    return [4 /*yield*/, ask('Forma de pagamento (Dinheiro/Cartão/PIX): ')];
                                case 16:
                                    formaPagamento = (_g.sent());
                                    return [4 /*yield*/, registrarEntrada({
                                            cliente: cliente,
                                            telefone: telefone,
                                            pedidoPizza: pizza, pedidoBebida: bebida,
                                            tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
                                            quantidadeBebidas: qtdBebida,
                                            sobremesa: sobremesa,
                                            quantidadeSobremesa: qtdSobremesa,
                                            enderecoEntrega: endereco,
                                            formaPagamento: formaPagamento
                                        })];
                                case 17:
                                    reg = _g.sent();
                                    return [4 /*yield*/, calcularPrecoTotal({
                                            tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
                                            quantidadeBebidas: qtdBebida,
                                            sobremesa: sobremesa,
                                            quantidadeSobremesa: qtdSobremesa
                                        })];
                                case 18:
                                    total = _g.sent();
                                    return [4 /*yield*/, emitirComprovante(reg, total)];
                                case 19:
                                    _g.sent();
                                    console.log("Pedido registrado. Total: R$ ".concat(total.toFixed(2)));
                                    return [3 /*break*/, 38];
                                case 20: return [4 /*yield*/, lerAtivos()];
                                case 21:
                                    ativos = _g.sent();
                                    if (ativos.length === 0) {
                                        console.log('Sem pedidos ativos.');
                                        return [3 /*break*/, 38];
                                    }
                                    console.log('\n=== Pedidos ativos ===');
                                    _i = 0, ativos_1 = ativos;
                                    _g.label = 22;
                                case 22:
                                    if (!(_i < ativos_1.length)) return [3 /*break*/, 25];
                                    p = ativos_1[_i];
                                    return [4 /*yield*/, calcularPrecoTotal({
                                            tamanhoPizza: p.tamanhoPizza,
                                            quantidadePizza: p.quantidadePizza,
                                            bordaRecheada: p.bordaRecheada,
                                            quantidadeBebidas: p.quantidadeBebidas,
                                            sobremesa: p.sobremesa,
                                            quantidadeSobremesa: p.quantidadeSobremesa
                                        })];
                                case 23:
                                    total = _g.sent();
                                    console.log("ID:".concat(p.idPedido, " - Cliente:").concat(p.cliente, " - Total R$ ").concat(total.toFixed(2), " - Forma:").concat(p.formaPagamento));
                                    _g.label = 24;
                                case 24:
                                    _i++;
                                    return [3 /*break*/, 22];
                                case 25: return [3 /*break*/, 38];
                                case 26:
                                    _f = Number;
                                    return [4 /*yield*/, ask('ID do pedido para finalizar: ')];
                                case 27:
                                    id_1 = _f.apply(void 0, [_g.sent()]);
                                    return [4 /*yield*/, lerAtivos()];
                                case 28:
                                    ativos = _g.sent();
                                    pedido = ativos.find(function (p) { return p.idPedido === id_1; });
                                    if (!pedido) {
                                        console.log('Pedido não encontrado.');
                                        return [3 /*break*/, 38];
                                    }
                                    return [4 /*yield*/, calcularPrecoTotal({
                                            tamanhoPizza: pedido.tamanhoPizza,
                                            quantidadePizza: pedido.quantidadePizza,
                                            bordaRecheada: pedido.bordaRecheada,
                                            quantidadeBebidas: pedido.quantidadeBebidas,
                                            sobremesa: pedido.sobremesa,
                                            quantidadeSobremesa: pedido.quantidadeSobremesa
                                        })];
                                case 29:
                                    total = _g.sent();
                                    return [4 /*yield*/, finalizarPedido(pedido, total)];
                                case 30:
                                    _g.sent();
                                    console.log("Pedido finalizado. Total: R$ ".concat(total.toFixed(2)));
                                    return [3 /*break*/, 38];
                                case 31: return [4 /*yield*/, fs_1.promises.writeFile(ARQ.ativos, CAB.ativos, 'utf8')];
                                case 32:
                                    _g.sent();
                                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8')];
                                case 33:
                                    _g.sent();
                                    console.log('Pedidos ativos limpos e ID reiniciado.');
                                    return [3 /*break*/, 38];
                                case 34: return [4 /*yield*/, relatorioVendas()];
                                case 35:
                                    _g.sent();
                                    return [3 /*break*/, 38];
                                case 36:
                                    sair = true;
                                    return [3 /*break*/, 38];
                                case 37:
                                    console.log('Opção inválida.');
                                    _g.label = 38;
                                case 38: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!!sair) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    rl.close();
                    console.log('Aplicativo encerrado.');
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Execução ------------------- */
main();

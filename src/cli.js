import fs from 'fs';
import path from 'path';
import trataErros from './erros/funcoesErro.js';
import { contaPalavras } from './index.js';
import { montaSaidaArquivo } from './helpers.js';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
    .version('0.0.1')
    .option('-t, --texto <string>', 'caminho do texto a ser processado.')
    .option('-d --destino <string>', 'caminho da pasta onde é salvo o arquivo de resultados.')
    .action((options) => {
        const { texto, destino } = options;

        if (!texto || !destino) {
            console.error(chalk.red('erro: favor inserir caminho de origem e destino'));
            program.help();
            return;
        }

        const caminhoTexto = path.resolve(texto);
        const caminhoDestino = path.resolve(destino);

        try {
            processaArquivo(caminhoTexto, caminhoDestino);
            console.log(chalk.green('Texto processado com sucesso.'));
        } catch (erro) {
            console.log(chalk.red('Ocorreu um erro no processamento.'))
        }
    })

program.parse();

function processaArquivo(texto, destino) {
    fs.readFile(texto, 'utf-8', (erro, texto) => {
        try {
            if (erro) throw erro;
            const resultado = contaPalavras(texto);
            criaSalvaArquivo(resultado, destino);
        } catch (erro) {
            console.log(trataErros(erro));
        }
    })
}

async function criaSalvaArquivo(listaPalavras, endereco) {
    const arquivoNovo = `${endereco}/resultado.txt`;
    const textoPalavras = montaSaidaArquivo(listaPalavras);
    try {
        await fs.promises.writeFile(arquivoNovo, textoPalavras);
        console.log('Arquivo criado!');
    } catch (erro) {
        throw erro;
    }
}

// function criaSalvaArquivo(listaPalavras, endereco) {
//     const arquivoNovo = `${endereco}/resultado.txt`;
//     const textoPalavras = JSON.stringify(listaPalavras);

//     fs.promises.writeFile(arquivoNovo, textoPalavras)
//         .then(() => {
//             console.log('Arquivo criado!');
//         })
//         .catch((erro) => {
//             throw erro;
//         })
//         .finally(() => console.log('Operação finalizada!'))
// }
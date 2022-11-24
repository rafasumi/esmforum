const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando consulta de pergunta a partir de ID', () => {
  modelo.cadastrar_pergunta('To be or not to be?');
  const perguntas = modelo.listar_perguntas();
  const pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);
  expect(pergunta.texto).toEqual(perguntas[0].texto);
  expect(pergunta.id_pergunta).toBe(perguntas[0].id_pergunta);
  expect(pergunta.id_usuario).toBe(perguntas[0].id_usuario);
});

test('Testando cadastro de três respostas para uma mesma pergunta', () => {
  modelo.cadastrar_pergunta('To be or not to be?');
  const id_pergunta = modelo.listar_perguntas()[0].id_pergunta;
  modelo.cadastrar_resposta(id_pergunta, 'Yes!');
  modelo.cadastrar_resposta(id_pergunta, 'No!');
  modelo.cadastrar_resposta(id_pergunta, 'Maybe!');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(3);
  expect(respostas[0].texto).toEqual('Yes!');
  expect(respostas[1].texto).toEqual('No!');
  expect(respostas[2].texto).toEqual('Maybe!');

  const num_respostas = modelo.get_num_respostas(id_pergunta);
  expect(num_respostas).toBe(3);
});

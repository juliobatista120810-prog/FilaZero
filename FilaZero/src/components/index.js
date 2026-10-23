 // Não estou conseguindo abrir o site para ver se foi ou não, O Samuel e Luiz, se estiver funcionando. Aqui tá a explicação de como o qrCode está funcionando.

// Isso Importa a biblioteca qrcode para o projeto
const QRCode = Require('qrcode');

// Cria e salva um arquivo de imagem PNG com o QR Code apontando para o link informado
QRCode.toFile('qrcode.png', 'https://github.com', function (err) {
  // Verifica se aconteceu algum erro durante a criação do arquivo
  if (err) console.error(err);
  
  // Aqui Exibe uma mensagem no terminal avisando que deu tudo certo
  console.log('QR Code gerado com sucesso!');
});
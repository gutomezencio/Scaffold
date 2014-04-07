Scaffold
========

Ferramenta para automatizar de forma genérica as tarefas mais comuns no dia-a-dia de entregas de Front-End.
* * *
Para que esse build system se tornasse realidade utilizamos o Grunt como core e alguns vários de seus plugins disponíveis.
Escolhemos o Grunt por ser uma ferramenta mais popular para este fim, por possuir uma boa documentação e também forte apoio da comunidade.

## Quais tarefas são executadas?

- Compilador LESS
- Otmização e minificação de SVG
- Combinação de Media Queries
- Automatização de geração de sprites
- Embed de imagens com base64
- Embed de fonts com base64
- Organização e otimização do CSS
- Minificação de CSS
- Inject de CSS sem reload da página
- Otimização de imagens
- Build de HTML (uso de includes e templates)
- Unificação de arquivos CSS
- Unificação de arquivos JS
- Uglify e minificação de JS
- Criação de cachebreaker
- Otimização e minificação do HTML
- Criação de ZIP do build
- Validação de JS
- Livereload no browser para visualização de alterações

## Instalação

Basicamente, para utilizar o Scaffold é necessário instalar as seguintes dependências na sua máquina:

- Node.js
- GD Library
- node-gd
- node-gyp
- No caso de usuários de Mac OS x recomendasse a instalação do Homebrew para agilizar a resolução das dependências: http://brew.sh/

#### Para instalar as dependências acima, utilize:

1. Node.js: Fazer download através do site http://nodejs.org/ e instalar

2. Instalar o GD:
    - Mac OS x: `brew install gd`
    - Ubuntu / Debian: `apt-get install libgd`
    - Outras distribuições: Utilizar um gerenciador de pacotes ou então fazer download e instalar através do site http://libgd.bitbucket.org/pages/downloads.html
    - Windows: ???
3. Baixar o módulo node-gd: `npm install -g node-gd`
4. Baixar o múdulo node-gyp: `npm install -g node-gyp`

## Uso

Para utilizar o Scaffold, basta copiar o source para a pasta onde iniciará o seu projeto:

    git clone https://github.com/marcosmoura/Scaffold.git

e instalar todos os módulos necessários através do comando:

    npm install

### Uso - Desenvolvimento

Após a instalação (download) de todos os módulos necessários, basta executar o comando de inicialização do grunt:

    grunt

feito isso o navegador irá ser aberto para visualização em tempo real do seu projeto, através da URL `http://0.0.0.0:9000/staging/`.
Desta forma o modo de desenvolvimento será iniciado.

Utilizamos o diretório `/dev` para desenvolvimento/modificações e o `/staging` para visualizações/testes, portanto não faça confusão ou seu trabalho poderá ser totalmente perdido!

    /dev - Desenvolvimento / Modificações
    /staging - Visualização / Testes

### Uso - Build

Após finalizar o seu projeto, você pode gerar o build através do comando:

    grunt build

Feito isso, o diretório `/build` irá conter a versão final do seu projeto, com todas as tarefas executadas.
Então teremos:

    /dev - Desenvolvimento / Modificações
    /staging - Visualização / Testes
    /build - Entrega / Deploy

## Estrutura de diretórios

    /dev  
    /build  
    /staging  
    .editorconfig  
    .gitattributes  
    .gitignore  
    .htmlhintrc  
    .GruntFile.js  
    README.md  
    TODO.md  

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/14ca58d6ccfe566a4af7538c4171dd0d "githalytics.com")](http://githalytics.com/marcosmoura/scaffold)

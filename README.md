Scaffold
========

Ferramenta para automatizar de forma genérica as tarefas mais comuns no dia-a-dia de entregas de Front-End.
* * *
Para que esse build system se tornasse realidade utilizamos o Grunt como core e alguns vários de seus plugins disponíveis.
Escolhemos o Grunt por ser uma ferramenta mais popular para este fim e por possuir uma boa documentação e também forte apoio da comunidade.

## Instalação

Basicamente, para utilizar o Scaffold é necessário instalar as seguintes dependências na sua máquina:

- Node.js
- GD Library
- node-gd
- node-gyp
- less
- No caso de usuários de Mac OS x recomendasse a instalação do Homebrew para agilizar a resolução das dependências: http://brew.sh/

#### Para instalar as dependencias acima, utilize:

1. Node.js: Fazer download através do site http://nodejs.org/ e instalar

2. Instalar o GD
    - Mac OS x: `brew install gd`
    - Ubuntu / Debian: `apt-get install libgd`
    - Outras distribuições: Utilizar um gerenciador de pacotes ou então fazer download e instalar através do site http://libgd.bitbucket.org/pages/downloads.html
    - Windows: ???
3. Baixar o módulo node-gd: `npm install -g node-gd`
4. Baixar o múdulo node-gyp: `npm install -g node-gyp`
5. Baixar o módulo less: `npm install -g less`

## Uso

Para utilizar o Scaffold, basta copiar o source para a pasta onde iniciará o seu projeto:

    git clone https://github.com/marcosmoura/Scaffold.git

e instalar todos os módulos necessários através do comando:

    npm install

Após feito isso, utilize a pasta /dev como diretório padrão de desenvolvimento. É neste diretório onde devem ser feitas todas as alterações no seu projeto.

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

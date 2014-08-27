Concrete Solutions
==========
Se quiser, ajude a melhorar nosso site, corrigindo ou aprimorando a experiência de uso. Faça um FORK do projeto e pronto!

----------

Como funciona
----------
Utilizamos [Jekyll](http://jekyllrb.com) uma Gem do [Ruby](http://www.ruby-lang.org/) para gerar páginas estáticas.

1. Instale o [Ruby](http://www.ruby-lang.org/pt/downloads/) 

2. Instale a Gem do [Jekyll](http://jekyllrb.com/):
    ```
    sudo gem install jekyll
    ```
3. Clone o projeto:
    ```
    git@github.com:pedrotcaraujo/concretesolutions.github.io.git
    ```
4. Vá a pasta do projeto:
    ```
    cd concretesolutions.github.io
    ```
5. Inicie o [Jekyll](http://jekyllrb.com/):
    ```
    jekyll serve
    ```
5. Acesse [http://localhost:4000/](http://localhost:4000/)


Estrutura básica de diretórios
----------
A pasta **css** tem textos sobre CSS em seguida da pasta **vendor** que possui dependências CSS. A pasta **fonts** tem todas as fontes usadas no projeto. A pasta **img** tem todas as imagens. E por último mas não menos importante, a pasta **js** guarda todos os JavaScript e afins seguida também da pasta **vendor** que possui dependências JS.

As pastas **about**, **carreira**, **clientes**, **contato**, **o-que-fazemos**, **projects** e **quem-somos**, são pastas que representa páginas e tem o arquivo do conteúdo de cada uma delas.


```
| concretesolutions.github.io/
|
|-- _drafts/
|   |-- news
|
|-- _includes/
|
|-- _layouts/
|
|-- about/
|
|-- carreira/
|
|-- clientes/
|
|-- contato/
|
|-- css/
|   |-- vendor
|
|-- fonts/
|
|-- img/
|
|-- js/
|   |-- vendor
|
|-- o-que-fazemos/
|
|-- projects/
|
|-- quem-somos/
```



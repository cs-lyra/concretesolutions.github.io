Concrete Solutions
==========
Se quiser, ajude a melhorar nosso site, corrigindo ou aprimorando a experiência de uso. Faça um FORK do projeto e pronto!

----------

Como funciona
----------
Utilizamos [Jekyll](http://jekyllrb.com) uma Gem do [Ruby](http://www.ruby-lang.org/) para gerar páginas estáticas.

1. Instale o [Ruby](http://www.ruby-lang.org/pt/downloads/) e sua versão para desenvolvimento (pacote ruby-dev ou ruby-devel)

2. Instale algum dos [runtimes](https://github.com/sstephenson/execjs#execjs) de JavaScript, se necessário. Exemplo: [nodeJS](http://nodejs.org/download/)

3. Instale as Gems do [Jekyll](http://jekyllrb.com/) e do [Jekyll-Sitemap](https://github.com/jekyll/jekyll-sitemap):
    ```
    sudo gem install jekyll jekyll-sitemap redcarpet
    ```

4. Clone o projeto:
    ```
    git@github.com:pedrotcaraujo/concretesolutions.github.io.git
    ```

5. Vá a pasta do projeto:
    ```
    cd concretesolutions.github.io
    ```

6. Inicie o [Jekyll](http://jekyllrb.com/):
    ```
    jekyll serve
    ```

7. Acesse [http://localhost:4000/](http://localhost:4000/)


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



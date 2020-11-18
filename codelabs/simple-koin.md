summary: Criando seu próprio Koin simplificado
id: simple-koin
categories: Kotlin
tags: kotlin, tutorial
status: Published
authors: Leandro Leite
Feedback Link: https://github.com/insertcoderepos/simple-koin

# Criando seu próprio Koin simplificado

## Visão Geral

O Koin é um framework famoso de Injeção de Dependência para Kotlin que vem sendo amplamento usado pela sua leveza e facilidade de implementação em projetos. Podemos observar a simplicidade da sua inicialização e utilização na [própria documentação do Koin](https://insert-koin.io/) com os seguintes exemplos:

**`Declare a module:`**
```
// Given some classes 
class Controller(val service : BusinessService) 
class BusinessService() 

// just declare it 
val myModule = module { 
  single { Controller(get()) } 
  single { BusinessService() } 
} 
```

**`Start Koin`**
```
fun main(vararg args : String) { 
  // start Koin!
  startKoin {
    // declare modules
    modules(myModule)
  }
}  
```

**`Inject by Constructor`**
```
// Controller & BusinessService are declared in a module
class Controller(val service : BusinessService){ 
  
  fun hello() {
     // service is ready to use
     service.sayHello()
  }
} 
```

É exatamente isso que vamos construir juntos! Usaremos uma aproximação simplificada para atingir resultados parecidos com o do framework Koin.

## Primeiros passos: Declarações e Módulos

Um Módulo no Koin é uma unidade que contém declarações de classes que podem ser injetadas em uma aplicação. Ao definir essas declarações, geralmente temos algo parecido com o código abaixo:

```
val myModule = module { 
    ...
    single { BusinessService() } 
    factory { Controller(get()) } 
    ...
} 
```

Em `single { BusinessService()) }`, chamamos de declaração a parte correspondente ao código `{ BusinessService()) }`. Pelo seu formato, podemos identificar que uma declaração é uma função sem argumentos que retorna uma instância de um tipo `T`, programaticamente descrita como a função lambda `() -> T`.

Para definir uma declaração, criaremos um `typealias` chamado `Declaration` com a finalidade de dar um significado ao tipo `() -> T` referente a uma função lambda de declaração.

**`Declaration.kt`**
```
typealias Declaration<T> = () -> T
```

Para representar o Módulo, inicialmente criaremos a classe `Module` e a primeira *Higher-Order Function* `module` para compor a DSL do nosso Koin simplificado. Também precisaremos armazenar as declarações desse nosso módulo. O que vamos querer localizar na classe `Module` são as declarações `Declaration< T >` de acordo com os seus tipos de classe `T` para atender as dependências de cada classe da aplicação. Para isso, criaremos um atributo que atenda esse propósito usando um `Map` com o **tipo da classe** como **chave** e **sua declaração** como **valor**. 

**`Module.kt`**
```
class Module {
    val declarationMap: MutableMap<KClass<*>, Declaration<Any>> = ConcurrentHashMap()
    ...
}

fun module(block: Module.() -> Unit) = Module().apply(block)
```

Obs.: usamos a implementação `ConcurrentHashMap` que resolve qualquer problema de concorrência que um `HashMap` simples possa ter

Até agora, é possível escrever o seguinte código usando a DSL do nosso Koin simplificado:

```
val myModule = module { 
    
} 
```

Precisamos implementar as *Higher-Order Functions* `single` e `factory`, além da função  `get()`.

Para o `factory`, teremos a seguinte *Inline Function*:

**`Module.kt`**
```
class Module { 
    ...

    inline fun <reified T: Any> factory(noinline declaration: Declaration<T>) {
        declarationMap[T::class] = declaration
    }
}
```

Algumas considerações sobre o código acima:

* O modificador `inline` diz ao compilador para copiar o corpo da função para o local onde ela foi chamada e executar seu código.
* O modificador `noinline` diz ao compilador que não copie o parâmetro `Declaration< T >` (que, na verdade, é a função lambda `() -> T`) junto com a função *inline* que a tem como parâmetro.
* O modificador `reified`, simplificando a explicação, atua em conjunto com o modificador `inline` fazendo com que o compilador conheça e, ao copiar o código da função `inline`, substitua o tipo `T` pelo tipo real em tempo de execução.

Declaramos então, também, a função `get()`:

**`Module.kt`**
```
class Module {
    ...
    inline fun <reified T: Any> get(): T {
        val declaration = declarationMap[T::class]
        var instance: Any? = declaration?.invoke() ?: error("Unable to find declaration of type ${T::class.qualifiedName}")

        return instance as T
    }
}
```

A função `get()` busca por uma `Declaration` no `declarationMap` de acordo com o tipo `T` da classe a ser buscada. Caso a declaração não seja encontrada no módulo, um erro é disparado informando que não foi possível encontrar tal declaração.

Repare que essa implementação está **incompleta**, já que também devemos procurar por declarações em outros módulos, pois é muito comum existir mais de um módulo Koin em uma aplicação. Completaremos essa implementação no próximo passo! 

Nesse ponto, a nossa classe `Module` está desta forma:

**`Module.kt`**
```
class Module {
    val declarationMap: MutableMap<KClass<*>, Declaration<Any>> = ConcurrentHashMap()

    inline fun <reified T: Any> factory(noinline declaration: Declaration<T>) {
        declarationMap[T::class] = declaration
    }

    inline fun <reified T: Any> get(): T {
        val declaration = declarationMap[T::class]
        var instance: Any? = declaration?.invoke() ?: error("Unable to find declaration of type ${T::class.qualifiedName}")

        return instance as T
    }
}
```

## Implementando single

Diferente do método `factory`, a função `single` retorna a mesma instância de uma classe quando declarada em um módulo. Para atender esse comportamento, teremos que fazer algumas alterações na classe `Module`.

Para começar, precisamos diferenciar os tipos de injeção de dependência suportados pelo nosso Koin simplificado. Para isso, criaremos o enum `InjectionType`.

**`InjectionType.kt`**
```
enum class InjectionType {
    SINGLE,
    FACTORY
}
```

Em seguida, além de armazenar as declarações `Declaration< T >` de acordo com seu tipo `T`, também precisamos armazenar em `Module` o tipo de injeção `InjectionType` de acordo com o tipo `T` de uma classe. Esse tipo de injeção será definido pelas funções `factory` e `single`.

**`Module.kt`**
```
class Module {
    val declarationMap: MutableMap<KClass<*>, Declaration<Any>> = ConcurrentHashMap()
    val injectionTypeMap: MutableMap<KClass<*>, InjectionType> = ConcurrentHashMap()

    inline fun <reified T: Any> factory(noinline declaration: Declaration<T>) {
        declarationMap[T::class] = declaration
        injectionTypeMap[T::class] = InjectionType.FACTORY
    }

    ...
}
```

Agora, ao incluirmos uma declaração pelo método `factory`, também incluiremos o tipo de injeção `FACTORY` para o tipo de classe `T`. Para armazenar e gerenciar esses tipos, usaremos o `Map` chamado  `injectionTypeMap` com par chave-valor `< KClass<*>, InjectionType >`

Após essas alterações, estamos prontos para implementar o método `single`. Diferentemente do método `factory`, devemos disponibilizar uma instância única para quem precisa de uma dependência `single`. Para isso, precisamos criar um `Map` chamado `instanceMap` com par chave-valor `MutableMap< KClass<*>, Any >` na classe `Module` de maneira que seja possível armazenar e gerenciar instâncias únicas de uma classe `T` de acordo com seu tipo `T`.

**`Module.kt`**
```
class Module {
    ...

    val instanceMap: MutableMap<KClass<*>, Any> = ConcurrentHashMap()

    inline fun <reified T: Any> single(noinline declaration: Declaration<T>) {
        instanceMap[T::class] = declaration.invoke()
        injectionTypeMap[T::class] = InjectionType.SINGLE
    }

    ...
}
```

O método `single` tem sua implementação bem parecida com o método `factory`, sendo diferente apenas no tipo de injeção `SINGLE` e na forma de lidar com as declarações `Declaration< T >`, uma vez que realiza a chamada dessas declarações utilizando o método `invoke()`, ou seja, cria uma instância de uma declaração usando seu construtor conforme declarado no módulo do nosso Koin simplificado.

Finalmente, para que possamos resolver as dependẽncias de maneira correta, precisamos atualizar o método `get()` escrito anteriormente. Dado um tipo `T`, precisaremos reconhecer qual é o seu tipo de injeção, `SINGLE` ou `FACTORY`, e recuperar a dependência do `Map` de instâncias únicas ou de declarações para criar uma nova instância.

**`Module.kt`**
```
class Module {
    ...

    inline fun <reified T: Any> get(): T {
        val injectionType = injectionTypeMap[T::class]
        var instance: Any? = null

        when(injectionType) {
            InjectionType.SINGLE -> instance = instanceMap[T::class]?.invoke()
            InjectionType.FACTORY -> instance = declarationMap[T::class]?.invoke()
        }

        if (instance == null)
            error("Unable to find declaration of type ${T::class.qualifiedName}")

        return instance as T
    }
}
```

## Inicializando o Koin simplificado

Até agora, nós criamos diversos elementos como declarações, objetos injetáveis e módulos. Começaremos a escrever a inicialização do nosso Koin simplificado para usar de fato as implementações que fizemos até aqui. 

A classe `SimpleKoin` será a classe principal do nosso Koin simplificado. É nela que iremos carregar os nossos `Modules` e disponibilizar seus injetáveis de acordo com os tipos `factory` e `single`. Seu código será o seguinte:

**`SimpleKoin.kt`**
```
class SimpleKoin {
    private lateinit var declarations: Map<KClass<*>, Declaration<Any>>
    private lateinit var instances: Map<KClass<*>, Any>
    private lateinit var injectionTypes: Map<KClass<*>, InjectionType>

    fun loadModules(modules: List<Module>) {
        declarations = modules.allDeclarations
        instances = modules.allInstances
        injectionTypes = modules.allInjectionTypes
    }

    fun getDeclaration(type: KClass<*>) = declarations[type]
    fun getInstance(type: KClass<*>) = instances[type]
    fun getInjectionType(type: KClass<*>) = injectionTypes[type]
}
```

Perceba que precisamos implementar as propriedades `allDeclarations`, `allInstances` e `allInjectionTypes` de `List< Module >`. Essas propriedades terão como seus métodos `get()` a resolução de todos os `declarationMap`, `instanceMap` e `injectionTypeMap` dos objetos da classe `Module` presentes em um `List< Module >`. Suas implementações ficam desta forma:

**`Module.kt`**
```
class Module {
    ...
}

val List<Module>.allDeclarations: Map<KClass<*>, Declaration<Any>>
    get() = this.fold(this[0].declarationMap) { allDeclarations, module ->
        (allDeclarations + module.declarationMap) as MutableMap<KClass<*>, Declaration<Any>>
    }

val List<Module>.allInstances: Map<KClass<*>, Any>
    get() = this.fold(this[0].instanceMap) { allInstances, module ->
        (allInstances + module.instanceMap) as MutableMap<KClass<*>, Any>
    }

val List<Module>.allInjectionTypes: Map<KClass<*>, InjectionType>
    get() = this.fold(this[0].injectionTypeMap) { allInjectionTypes, module ->
        (allInjectionTypes + module.injectionTypeMap) as MutableMap<KClass<*>, InjectionType>
    }
```

Obs.: a resolução que descrevemos acima é chamada de acúmulo e existe uma operação de listas chamada `fold` para executá-la. Basicamente, a operação recebe como parâmetro inicial o `Map` do objeto `Module` da posição `0` da lista `List< Module >` que será manipulada e vai acumulando com os `Maps` de todos os elementos da lista até o seu último elemento. O resultado final é um único `Map` com todas as entradas dos `Maps` da lista `List< Module >` que sofreu o acúmulo. 

Repare que o método `loadModules()` faz o acúmulo de todas as declarações de injetáveis dos `Modules` do nosso Koin simplificado. Dessa forma, podemos reunir em apenas um local a resolução de uma dependência sem importar em que módulo ela foi declarada.

Os outros métodos `getDeclaration()`, `getInstance()` e `getInjectionType()` servem apenas para buscar e retornar uma dependência de um injetável sem ter que expor os `Maps` da classe `SimpleKoin`. Usaremos esse métodos quando atualizarmos os nossos métodos `get()` que resolvem dependências na classe `Module`.

Com isso, completamos o código da classe `SimpleKoin` e podemos escrever o *singleton* `SimpleKoinContext` que ajuda a manipular uma instância de `SimpleKoin` e também a inicializar o nosso Koin simplificado.

**`SimpleKoinContext.kt`**
```
object SimpleKoinContext {
    private val simpleKoin = SimpleKoin()

    fun modules(modules: List<Module>) {
        simpleKoin.loadModules(modules)
    }

    fun getSimpleKoin() = simpleKoin
}

fun startSimpleKoin(block: SimpleKoinContext.() -> Unit) = SimpleKoinContext.apply(block)
```

## Finalizando as funções de injeção

Vamos finalizar o nosso Koin simplificado implementando os métodos `get()` e `inject()` que servem para inicializar objetos que queremos injetar em uma classe sem ter que passá-los como argumentos em um construtor.

**`Module.kt`**
```
...
class Module { 
    ...
}

inline fun <reified T: Any> get(): T {
    val injectionType = getSimpleKoin().getInjectionType(T::class)
    var instance: Any? = null

    when(injectionType) {
        InjectionType.SINGLE -> instance = getSimpleKoin().getInstance(T::class)
        InjectionType.FACTORY -> instance = getSimpleKoin().getDeclaration(T::class)?.invoke()
    }

    if (instance == null)
        error("Unable to find declaration of type ${T::class.qualifiedName}")

    return instance as T
}

inline fun <reified T: Any> inject(): Lazy<T> = lazy { get<T>() }

```

O método `get()` busca uma dependência em todos os objetos `Module` disponibilizados para a classe `SimpleKoin`. Observe que, como dito anteriormente, não armazenamos os módulos `Module` inicializados e sim todas as suas dependêcias já organizadas em declarações `Declaration< T >` e instâncias de `T` de acordo com os tipos de injeção `SINGLE` e `FACTORY`. O método `inject()` é apenas a implementação `Lazy` do método `get()`.

Também temos que atualizar o método `get()` da classe `Module` que ficou pendente em um passo anterior. Da primeira forma como foi implementado, o método somente buscaria as dependências injetáveis no próprio `Module`. Como já implementamos as classes `SimpleKoin` e `SimpleKoinContext`, podemos atualizar esse método `get()` para, caso não encontre a dependência no próprio módulo, busque nos outros módulos declarados no nosso Koin simplificado. O novo código do método ficará desta forma:

**`Module.kt`**
```
class Module {
    ...
    
    inline fun <reified T: Any> get(): T {
        val injectionType = getInjectionType(T::class)
        var instance: Any? = null

        when(injectionType) {
            InjectionType.SINGLE -> instance = getSingletonInstance(T::class)
            InjectionType.FACTORY -> instance = getFactoryInstance(T::class)
        }

        if (instance == null)
            error("Unable to find declaration of type ${T::class.qualifiedName}")

        return instance as T
    }

    fun getInjectionType(type: KClass<*>) = injectionTypeMap[type] ?: getSimpleKoin().getInjectionType(type)

    fun getSingletonInstance(type: KClass<*>) = instanceMap[type] ?: getSimpleKoin().getInstance(type)

    fun getFactoryInstance(type: KClass<*>) =
            declarationMap[type]?.invoke() ?: getSimpleKoin().getDeclaration(type)?.invoke()

}
```

## Utilizando o Koin simplificado

Vamos começar implementando as classes de uma arquitetura simples para que possamos usá-las no nosso `SimpleKoin`.

**`Main.kt`**
```
class ViewModel(private val useCase: UseCase) {
    fun getData() {
        println(useCase.execute())
    }
}

class UseCase(private val repo: Repository) {
    fun execute() = repo.getData()
}

class Repository(private val service: Service) {
    fun getData() = service.getData()
}

interface Service {
    fun getData() : String
}

class ServiceImpl : Service {
    override fun getData(): String  = "Data from service!"
}
```

Dessa forma, teremos um `ViewModel` que necessitará de um `UseCase` para acessar um `Repository` que busca uma informação em um `Service`. 

Agora, precisamos inicializar o nosso `SimpleKoin`. Também vamos dividir as declarações desses injetáveis em dois módulos para garantir que o nosso Koin simplificado funciona corretamente.

**`Main.kt`**
```
val module1 = module {
    single { ServiceImpl() as Service }
    factory { ViewModel(get()) }
    factory { Repository(get()) }
}

val module2 = module {
    factory { UseCase(get()) }
}

fun main() {
    startSimpleKoin {
        modules(
            listOf(
                module1,
                module2
            )
        )
    }
}
```

Com isso, nosso `SimpleKoin` está inicializado, as dependências da nossa aplicação estão sendo informadas e poderão ser resolvidas utilizando o padrão de Injeção de Dependência. Vamos terminar de escrever o código que chama um `ViewModel` para executar a nossa aplicação e perceber que todas as dependências de todas as classes foram resolvidas pelo nosso Koin simplificado.

**`Main.kt`**
```
fun main() {
    startSimpleKoin {
        modules(
            listOf(
                module1,
                module2
            )
        )
    }

    val viewModel: ViewModel by inject()
    val repository: Repository = get()

    viewModel.getData()
    println(repository.getData())
}
```

Rodando o código acima, temos como resposta a seguinte saída:

```
Data from service!
Data from service!
```

Isso prova que todas as nossas dependências foram resolvidas e que os métodos `get()` e `inject()` funcionam corretamente!

Além disso, escrevendo um pouco mais de código, também conseguimos provar que as funções `factory` e `single` estão corretas:

**`Main.kt`**
```
fun main() {
    startSimpleKoin {
        modules(
            listOf(
                module1,
                module2
            )
        )
    }

    val repository1: Repository = get()
    val repository2: Repository = get()
    val service1: Service = get()
    val service2: Service = get()

    println(repository1)
    println(repository2)
    println(service1)
    println(service2)
}
```

O resultado do código acima será algo parecido com a seguinte saída:

```
com.github.leanite.Repository@28ba21f3
com.github.leanite.Repository@694f9431
com.github.leanite.ServiceImpl@f2a0b8e
com.github.leanite.ServiceImpl@f2a0b8e
```

Com isso, podemos perceber que os objetos de `Repository`, que foi declarada como `factory`, são diferentes e que os objetos de `Service`, declarada como `single`, são a mesma instância!

## Considerações finais

Com alguns passos é possível escrever uma implementação simples, porém interessante, de um Koin simplificado!

Se quiser dar uma olhadinha, o código desse codelab está no [GitHub](https://github.com/insertcoderepos/simple-koin).

Nos vemos em outro codelab!
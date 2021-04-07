summary: Trabalhando com View Binding
id: trabalhando-com-view-binding
categories: Android
tags: codelab, tutorial, android
status: Published
authors: Charles Moreira
Feedback Link: http://github.com/

# Trabalhando com View Binding

## Antes de começar
Duration: 3

Vamos começar primeiro informando que a JetBrains descontinuou o famoso plugin `Kotlin Android extension`, deixando-o, assim, obsoleto a partir da versão [1.4.20-M2](https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M2).

### Synthetic não é mais uma prática recomendada

O Synthetic requer menos código do que qualquer outra solução e também é extremamente fácil de usar, então por que não é mais uma prática recomendada? Existem problemas famosos com `kotlinx synthetic`, como por exemplo:

- Ao criar um nameID para seu layout, você acaba expondo esse ID globalmente para todo seu projeto.
- As suas views não são seguras contra nulabilidade, podendo causar exceções surpresas. 
- E por fim, você só conseguirá utilizá-lo em uma classe Kotlin, o que pode ser um problema se estiver trabalhando em um projeto totalmente em Java ou misto.

### Opções alternativas

- O tradicional `findViewById()` que funciona bem para Kotlin e Java.
- Temos a famosa library `Butter Knife`, muito utilizada em projetos Java. Mas atenção, ela recentemente foi descontinuada.
- E por último, e também o nosso objetivo deste tutorial, temos o `View Binding`, que é um recurso que nos permite escrever códigos mais simples. O código não chega a ser tão simples quanto o `kotlinx synthetic`, porém ainda é melhor que o `findViewById()` por conseguir nos proporcionar segurança contra nulos, layouts globais e ser funcional tanto para Java quanto para Kotlin.

#### Para saber mais, acesse a documentação oficial clicando [aqui](https://developer.android.com/topic/libraries/view-binding?hl=pt-br).


## Habilitando o View Binding
Duration: 2

Para habilitar o View Binding, é só adicionar a seguinte instrução no `build.gradle` do módulo que será utilizado:

```groovy
android {
    ...
    buildFeatures {
       viewBinding true
    }
    ...
}
```

Se por algum motivo você queira que algum layout do seu projeto não tenha a vinculação feita pelo `View Binding`, adicione o atributo: `tools:viewBindingIgnore="true"` no seu `ViewGroup` principal.

```xml
<LinearLayout
    ...
    tools:viewBindingIgnore="true" >
    ...
</LinearLayout>
```

Se o `View Binding` estiver habilitado para um módulo, uma classe de binding será gerada para cada arquivo de layout XML que o módulo possui. 

Cada classe de binding contém referências ao ViewGroup principal e a todas as views que têm um ID. 

```xml
<LinearLayout>
...
<TextView android:id="@+id/txtName" />
...
</LinearLayout>
```

O nome da classe de binding é gerado conforme o nome do XML convertido em pascal case e concatenado com a palavra binding ao final. 

Exemplo: `ActivityMainBinding`

## Utilizando View Binding em uma Activity
Duration: 3

Toda classe de binding inclui uma função get chamada `root` que disponilbiliza uma referência direta para o ViewGroup principal do layout correspondente.

```kotlin
private lateinit var binding: ActivityMainBinding

override fun onCreate(savedInstanceState: Bundle) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)

    setupView()
}

private fun setupView() {
    binding.txtName.text = "Batman"
}    
```

## Utilizando View Binding em um Fragment
Duration: 3

Para configurar uma instância da classe binding em um Fragment, é preciso manter a atenção e limpar todas as referências da classe binding no `onDestroyView()`. Desta forma, evitaremos o famoso **Memory Leak**.

```kotlin
private var _binding: FragmentMainBinding? = null

private val binding get() = _binding!!

override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
): View? {
    _binding = FragmentMainBinding.inflate(inflater, container, false)
    return binding.root
}

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    
    setupView()
}

override fun onDestroyView() {
    super.onDestroyView()
    _binding = null
}

private fun setupView(){
    binding.txtName.text = "Batman"
}
```

## Utilizando View Binding em um ViewHolder
Duration: 3

Você só vai precisar passar o objeto da classe de binding gerado para o construtor da classe titular e se certificar de passar o ViewGroup principal para a classe pai do ViewHolder. 

Exemplo: `RecyclerView.ViewHolder(binding.root)`

```kotlin
class UserAdapter(private val userList: List<User>) : RecyclerView.Adapter<UserAdapter.UserHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PaymentHolder {
        val binding = RowUserBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return UserHolder(binding)
    }

    override fun onBindViewHolder(holder: UserHolder, position: Int) {
        val user: User = userList[position]
        holder.bind(user)
    }

    ...

    class UserHolder(private val binding: RowUserBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(user: User) = with(binding) {
            tvRowName.text = user.name
        }
    }
}
```

## Considerações finais
Duration: 1

Neste Codelab vimos que a utilização do `View Binding` nos traz facilidade e segurança de uma forma conciza e clara para o nosso dia a dia. 

Espero que tenham gostado e nos vemos em outro Codelab!






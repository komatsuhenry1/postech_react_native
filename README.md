# Clima Tempo - Mobile Application

Bem-vindo ao repositório do aplicativo móvel **Clima Tempo**. Este projeto é desenvolvido com **React Native** utilizando **Expo** e **Expo Router**, focado em fornecer uma experiência moderna e eficiente para consulta de informações climáticas e interação social através de posts.

## 🚀 Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias e bibliotecas principais:

- **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de aplicativos móveis nativos.
- **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para React Native.
- **[Expo Router](https://docs.expo.dev/router/introduction)**: Sistema de roteamento baseado em arquivos (semelhante ao Next.js).
- **[TypeScript](https://www.typescriptlang.org/)**: Superset de JavaScript que adiciona tipagem estática.
- **Async Storage**: Armazenamento local para persistência de dados (tokens, roles).

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter o ambiente configurado:

1.  **Node.js** (versão 18 ou superior recomendada).
2.  **npm** ou **yarn**.
3.  Um emulador Android/iOS configurado ou o app **Expo Go** instalado no seu dispositivo físico.

## 🛠️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd clima-tempo
```

### 2. Instalar dependências

Utilize o `npm` para instalar as bibliotecas necessárias:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto para configurar a URL da API. Você pode usar o arquivo de exemplo ou criar do zero:

**Arquivo `.env`:**

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
# Nota: Para emuladores Android, use http://10.0.2.2:3000
# Para usar no dispositivo físico, use o IP da sua máquina na rede local (ex: http://192.168.1.5:3000)
```

## 🏗️ Arquitetura da Aplicação

A arquitetura do projeto segue o padrão modular facilitado pelo Expo Router e separação de responsabilidades.

### Estrutura de Pastas

- **`app/`**: Contém as telas e a lógica de roteamento.
    - **`(auth)/`**: Grupo de rotas protegidas ou relacionadas à autenticação (Login, Registro).
    - **`(admin)/`**: Rotas administrativas (se houver).
    - **`(user)/`**: Rotas acessíveis para usuários comuns.
    - **`_layout.tsx`**: Define o layout global e configurações de navegação (Stack, Tabs).
    - **`index.tsx`**: Ponto de entrada inicial (redirecionamento ou tela Home).

- **`services/`**: Camada de comunicação com a API externa.
    - **`api.ts`**: Centraliza todas as chamadas HTTP (Login, Cadastro, Posts), utilizando `fetch` e tratando erros.

- **`components/`**: Componentes reutilizáveis da UI (Botões, Inputs, Cards).

- **`assets/`**: Imagens, fontes e outros recursos estáticos.

### Fluxo de Dados e Autenticação

1.  **Autenticação**: O usuário realiza login/cadastro via `services/api.ts`.
2.  **Persistência**: O `role` (papel do usuário) é salvo no `AsyncStorage` para controle de acesso.
3.  **API**: As requisições para a API incluem o `role` no Header quando necessário para autorização no backend.

## ▶️ Como Executar

Após configurar o ambiente, inicie o servidor de desenvolvimento:

```bash
npx expo start
```
ou
```bash
npm start
```

### Opções de Execução:
- **Pressione `a`**: Para abrir no emulador Android.
- **Pressione `i`**: Para abrir no simulador iOS (apenas macOS).
- **Pressione `w`**: Para abrir no navegador web.
- **Escaneie o QR Code**: Com o app **Expo Go** no seu celular para testar no dispositivo físico.

## 📚 Documentação Adicional

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
- [Guia do Expo Router](https://docs.expo.dev/router/introduction)

---
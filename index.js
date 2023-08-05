
const express = require('express') // Chama a biblioteca Express para o projeto
const uuid = require('uuid') // Chama a biblioteca UUID para o projeto

const port = 3000 // Define o valor 3000 para a const port
const app = express() // Coloca a função Express na const app
app.use(express.json()) // 


const requests = [] // Cria um array para armazenar os pedidos gerados

const middlewareCheckOrderId = (request, response, next) => { // Cria um middleware para checar o id informado na rota

    const {id} = request.params // Armazena o id inserido no params

    const index = requests.findIndex(order => order.id === id) // Cria uma const index que irá procurar no array pelo id inserido no params e retornar a posição do array que o objeto se encontra
    if (index < 0) { // Caso o id inserido não exista, o valor de index correspondente a posição do objeto no array será -1
        return response.status(404).json({message: "User not found!"}) // Retorna o status 404 (não encontrado) e a mensagem "User not found!"
    }

    request.orderIndex = index // Cria uma variável no request para armazenar o valor de index
    request.orderId = id // Cria uma variável no request para armazenar o valor do id

    next() // Continua a execução do programa
}

app.get('/order', (request, response) => { // Cria uma rota do tipo GET para fazer a leitura dos itens da rota order

    return response.json(requests) // Retorna todos os pedidos armazenados no array requests
})

app.post('/order', (request, response) => { // Cria uma rota do tipo POST para adicionar um novo pedido na rota order

    const {order, clientName, price, status} = request.body // Armazena as informações inseridas no body da rota
    const demand = {id: uuid.v4(), order, clientName, price, status} // Cria um pedido com as informações armazenadas, além de criar um id chamando a função uuid.v4()
    requests.push(demand) // Salva o pedido criado no array requests

    return response.status(201).json(demand) // Retorna o status 201 e o json com os dados do pedido gerado
})

app.put('/order/:id', middlewareCheckOrderId, (request, response) => { // Cria uma rota do tipo PUT para atualizar os dados de um pedido específico filtrado pelo id

    const id = request.orderId
    const {order, clientName, price, status} = request.body // Armazena as informações inseridas no body da rota
    const updateDemand = {id, order, clientName, price, status} // Cria um pedido com as informações atualizadas

    const index = request.orderIndex
    requests[index] = updateDemand // Caso o id exista, substitui o objeto correspondente com o pedido atualizado

    return response.json(updateDemand) // Retorna o objeto atualizado
})

app.patch('/order/:id', middlewareCheckOrderId, (request, response) => { // Cria uma rota do tipo PATCH para atualizar um dado de um pedido específico filtrado pelo id

    const index = request.orderIndex
    requests[index].status = "Pronto" // Caso o id exista, substitui o valor da variável para a string "Pronto"

    return response.json(requests[index]) // Retorna o objeto atualizado
})

app.delete('/order/:id', middlewareCheckOrderId, (request, response) => { // Cria uma rota do tipo DELETE para deletar um pedido específico filtrado pelo id

    const index = request.orderIndex
    requests.splice(index,1) // Deleta 1 objeto na posição encontrada pelo index do array requests

    return response.status(204).json() // Retorna o status 204 e um objeto vazio
})

app.listen(port, () => { // Define a porta do servidor em que a aplicação será executada
    console.log(`Server started on port ${port} 😎`) // Imprime na tela uma mensagem quando o servidor for iniciado
})
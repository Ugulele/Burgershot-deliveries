import productsList from "./products.js";

const rootElement = document.querySelector(".root")

const createListElement = () => {
    const productsListElement = document.createElement("ul")
    rootElement.appendChild(productsListElement)

    return productsListElement
}

const createListItem = (product) => {
    const listItem = document.createElement("li")

    const listItemName = document.createElement("div")
    listItemName.innerText = `${product.name}:`
    listItem.appendChild(listItemName)

    const listItemInput = createListInput(product)
    listItem.appendChild(listItemInput)

    return listItem
}

const createListInput = (product) => {
    const listItemInput = document.createElement("input")
    listItemInput.type = "number"
    listItemInput.name = product.name

    return listItemInput
}

const createTextAreaElement = () => {
    const placeForTextArea = document.createElement("section")
    const placeForTextAreaLabel = document.createElement("span")
    placeForTextAreaLabel.innerText = "Dostawa i jej koszt:"

    placeForTextArea.appendChild(placeForTextAreaLabel)
    rootElement.appendChild(placeForTextArea)

    const textArea = document.createElement("textarea")
    placeForTextArea.appendChild(textArea)
    textArea.readOnly = true
    textArea.id = "delivery_and_cost_output"

    return placeForTextArea
}

const injectTextAreaValue = (deliveryString, totalCost) => {
    const textArea = document.querySelector("textarea")

    textArea.value = totalCost ? `${deliveryString}\nZa dostawę zapłacisz: ${totalCost}$` : ""
}

const createFooterElement = () => {
	const footer = document.createElement("footer")
	document.body.appendChild(footer)

	const date = new Date()

	const link = document.createElement("a")
	link.href = "https://github.com/Ugulele"
	link.target = "_blank"
	link.innerHTML = `&copy; Ugulele ${date.getFullYear()}`
	footer.appendChild(link)
}

const getLimitForDaytime = (key) => {
	const now = new Date()
	let limit = productsList[key]["limit"]
	if (now.getHours() > 21 || now.getHours() < 9) {
		limit = Math.min(35, productsList[key]["limit"])
	}

	return limit
}

const createDeliveryString = (inputList) => {
    const inputNormalizedList = []
    inputList.forEach((item, key)=> {
        const limit = getLimitForDaytime(key)
        if(item.value && Number(item.value) >= 0 &&(Number(item.value) < limit)){
            inputNormalizedList.push({
                "name": item.name,
                "value": Number(item.value) < limit ? limit - Number(item.value): 0,
            })
        } 
    })
    return inputNormalizedList.map((item) => `${item.name} x${item.value}`).join(", ")
}

const calculateTotalCost = (inputList) => {
    const costList = []
    inputList.forEach((input, key) => {
        let currentValue
        if(!input.value || Number(input.value < 0)){
            currentValue = 0
        }else{
            const limit = getLimitForDaytime(key)
            currentValue = Number(input.value) < limit ? limit - Number(input.value): 0
        }
        costList.push(currentValue*productsList[key]["price"])
    })
    
    return costList.reduce((sum, currentPrice)=> sum+currentPrice, 0)
}

const mapInputsList = () => {
    document.querySelector("main").addEventListener("input", () => {
        const inputList = document.querySelectorAll("input")

        const deliveryString = createDeliveryString(inputList)
        const totalCost = calculateTotalCost(inputList)

        injectTextAreaValue(deliveryString, totalCost)
    })
}


const renderApp = () => {

    const productsListElement = createListElement()

    productsList.forEach((product) => {
        productsListElement.appendChild(createListItem(product))
    })

    mapInputsList()

    createTextAreaElement()

    createFooterElement()

}

window.addEventListener("load", renderApp)
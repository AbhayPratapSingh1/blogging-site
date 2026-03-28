class manager {
    
    // this is for adding tags arround the text passed and return the text with the text and classes
    
    addTagToText(tag, text, classes){
        let returningText = `<${tag} className="${classes}">${text}</${tag}>`
        console.log("returnung text : ", returningText);
        return returningText
    }

    // this is used to extract the text from the line passed to it
    extractText(textLine, from, to){
        if(to < 0 ){
            to = textLine.length + to
        }
        return textLine.slice(from, to)
    }
}
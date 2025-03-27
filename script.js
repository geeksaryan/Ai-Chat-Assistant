let prompt = document.querySelector("#prompt");
let submit=document.querySelector("#submit")
let chat_container = document.querySelector(".chat-container");
let imageBtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")
 

prompt.addEventListener("keydown", (e) => {
    //When we pess on enter then the value you have written in input will be taken
    if (e.key === "Enter" && prompt.value.trim() !== "") {  
        handleChatResponse(prompt.value);  
        prompt.value = "";  // Clear input field after sending
    }
});
submit.addEventListener("click",()=>{
    handleChatResponse(prompt.value);  
    prompt.value = ""; 
})
//creating chat-container which contain user-chat-box,img,user-chat-area
// soo from befoe we have img and user-chat-area 
// will only create user-chat-box and append in chat-container 
function handleChatResponse(userMessage) {
    user.message = userMessage;
    let userHtml = `
        <img src="assets/user.png" alt="" id="user-image" width="8%">
        <div class="user-chat-area">
            ${user.message.replace(/\n/g, '<br>')} <!-- Replace newlines with <br> -->
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
        </div>
    `;
    let userChatBox = document.createElement("div");
    userChatBox.innerHTML = userHtml;
    userChatBox.classList.add("user-chat-box");
    chat_container.appendChild(userChatBox);
    chat_container.scrollTo({ top: chat_container.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiHtml = `
            <img src="assets/ai.png" alt="" id="ai-image" width="8%">
            <div class="ai-chat-area">
                <img src="assets/loading.webp" class="load" alt="" width="50px">
            </div>
        `;
        let aiChatBox = document.createElement("div");
        aiChatBox.innerHTML = aiHtml;
        aiChatBox.classList.add("ai-chat-box");
        chat_container.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}

const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCbyKwNTg869DTPuj3yZgd_t7ij6xw2N48"
// const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GOOGLE_API_KEY"
let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let ResponseOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                "contents": [{
                    "parts": [{ "text": user.message }, (user.file.data ? [{ "inline_data": user.file }] : [])]
                }]
            }
        )
    };
    try {
        let response = await fetch(Api_url, ResponseOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse.replace(/\n/g, '<br>'); // Replace newlines with <br>
    } catch (error) {
        console.log(error);
    } finally {
        chat_container.scrollTo({ top: chat_container.scrollHeight, behavior: "smooth" });
        image.src = `assets/img.svg`;
        image.classList.remove("choose");
        user.file = {};
    }
}

imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return 
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})
imageBtn.addEventListener("click",()=>{
    imageBtn.querySelector("input").click()
})


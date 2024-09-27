const contact_name = document.getElementById("contact-name");
const contact_phone = document.getElementById("contact-phone");
const contact_email = document.getElementById("contact-email");
const contact_message = document.getElementById("contact-message");

const subject = document.getElementById("subject");

const contact_form = document.getElementById("contact-form");

contact_form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = {
        name:contact_name.value,
        email:contact_email.value,
        phone:contact_phone.value,
        message:contact_message.value,
        subject:subject.value,
    }


    emailjs.send("service_eahizlw","template_8hqk352", {
        name: data.name,
        email: data.email,
        message: JSON.stringify(data)
    }).then((response)=>{
        contact_name.value=""
        contact_email.value=""
        contact_phone.value=""
        contact_message.value=""
        subject.value=""
    },(error)=>console.log(error));

})
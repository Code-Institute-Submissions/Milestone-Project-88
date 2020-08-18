//Code adapted from Code Institute Interactive Development Module

//Emails user input data using EmailJS function
function sendMail(contactform) {
    emailjs.send("gmail", "patagonianexperience", {
        "first_name": contactform.firstname.value,//Link to contactForm input on contact page
        "last_name": contactform.lastname.value,
        "from_email": contactform.emailaddress.value,
        "travel_query": contactform.query.value
    })
    .then(
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            console.log("FAILED", error);
        }
    );
    return false;  // To block from loading a new page
}


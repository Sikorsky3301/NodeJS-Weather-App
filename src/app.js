const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")


const app  = express()


// Define Paths for Express config 
const publicDirectorypath  = path.join(__dirname , '../public')
const viewspath = path.join(__dirname , "../templates/views")
const partialspath = path.join(__dirname , '../templates/partials')



// Setup handlebars engine and views location 
app.set('views' , viewspath)
app.set('view engine' , 'hbs')
hbs.registerPartials(partialspath)



// ...............Setup Static Directory to Serve.................
app.use(express.static(publicDirectorypath))



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/weather' , (req , res) => {
    if(!req.query.address ){
        return res.send({
            error: "You must provide an address "
        })
    }
    
        geocode(req.query.address , (error , {latitude , longitude , location} = {}) => {

        if (error) { 
            return res.send({error})
        }

            forecast(latitude , longitude  , (error,forecastData) => {

                if (error) { 
                    return res.send({ error })
                }

                res.send({
                    forecast: forecastData,
                    location, 
                    address: req.query.address
                })
            })
    })

})


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.get("/help", (req, res) => {
    res.render("help" , {
        helptext : "This is Help Text" ,
        title:"Help",
        name : "Rishi Raj"
    })
})

app.get('/about' , (req , res) => {
    res.render("about" , {
        title:"About Me",
        name:"Rishi Raj"
    })
})

app.get('' , (req, res) => {
    res.render("index" , {
        title:"Weather App" ,
        name:"Rishi Raj"
    })
})


 
// products panel 
app.get('/products' , (req ,res) => {
    if (!req.query.search){
        return res.send({
            error: "You must provide a search term"
        })
    }
      
    console.log(req.query.search)
    res.send({
        products : []     
    })
})


// PAGE NOT FOUND RETURNS

app.get("/help/*" , (req , res) => {
    res.render("404" , {
        title: "404" ,
        name : "RishiRaj",
        error: "Help Page Not Found"

    })
})

app.get("*" , (req , res) => {       // " * " - Wild card Character
   res.render("404" , {
     title : "404",
     name : "RishiRaj",
     error: "Page Not Found"

   })
})





// END

app.listen(3000, () => {
    console.log("Server is Running!")
})
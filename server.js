const dotenv = require("dotenv")
const express = require("express");
const mongo = require('./mongo')
const blogModel = require('./models');
var methodOverride = require('method-override')

const app = express();

const PORT = process.env.PORT || 80;

async function connectToMongoDB(user) {
    await mongo().then(async (mongoose) => {
        try {
            console.log("connected");
            user = await user.save();

        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    })
    return user;
}


express.static("static")

app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    let DBarticles
    await mongo().then(async (mongoose) => {
        try {
            console.log("connected at home");

            DBarticles = await blogModel.find({}).sort({date : 'desc'})
        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    })
    res.render("blogposts/index", { articles: DBarticles })
})

app.get("/about.html", (req, res) => {
    res.render("about")
})

app.get("/contact.html", (req, res) => {
    res.render("contact")
})


app.get('/articles/new', (req, res) => {
    res.render("blogposts/new")
})

app.get('/articles/post', (req, res) => {
    res.render("blogposts/post")
})

app.post('/', async (req, res) => {
    let DBarticle = new blogModel({
        title: req.body.title,
        author: req.body.author,
        des: req.body.des
    })

    try {
        DBarticle = await connectToMongoDB(DBarticle);
        res.redirect(`/articles/${DBarticle.id}`)
    } catch (e) {
        console.log(e);
    }
})

app.get('/articles/:id',async (req, res) => {

    await mongo().then(async (mongoose) => {
        try {
            console.log("connected while showing article after saving");

            let article = await blogModel.findById(req.params.id)
            if (article == null) res.redirect('/')
            else {
                res.render('blogposts/post', { article: article })
                console.log(article);
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    })

})

app.delete("/articles/:id", async (req,res)=>{
    await mongo().then(async (mongoose) => {
        try {
            await blogModel.findByIdAndDelete(req.params.id)
            res.redirect("/");
        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    }) 
})


app.get("/articles/edit/:id",async (req,res)=>{
    
    await mongo().then(async (mongoose) => {
        try {
            console.log("connected while showing article after saving");

            let article = await blogModel.findById(req.params.id)
            res.render("blogposts/edit",{article : article})
        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    })
})

app.put("/articles/:id",async (req,res)=>{
    await mongo().then(async (mongoose) => {
        try {
            await blogModel.updateOne(
                {"_id": req.params.id},
                { $set: {"title" : req.body.title, "author" : req.body.author, "des" : req.body.des } }
            )
            res.redirect("/")
        } catch (e) {
            console.log(e);
        }
        finally {
            await mongoose.connection.close();
        }
    })
})



app.listen(PORT)
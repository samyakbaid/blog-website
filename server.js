import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";



const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
const __dirname=dirname(fileURLToPath(import.meta.url))
var newPost=[];
let blogPosts=[];
var blogTitle=[];
var blogContent=[];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/index', async (req,res)=>{

  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});


  
app.get('/new-post', (req,res)=>{
  res.render("new-post.ejs", { heading: "New Post", submit: "Create Post" });
});



app.post("/post", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect('/index')
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});


app.get('/edit/:id', async (req, res) => {
  const index = req.params.id;
  const posts = (await axios.get(`${API_URL}/posts/${index}`)).data
    res.render('edit.ejs', { post: posts});
  });

  app.post('/edit/:id', async (req, res) => {
    console.log("called");
    const index = req.params.id;
    try {
      const response = await axios.patch(
        `${API_URL}/posts/${index}}`,
        req.body
      );
      console.log(response.data);
      res.redirect("/index");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
   });



app.get('/delete/:id', async (req, res) => {
  try {
    const index=(req.params.id)
    await axios.delete(`${API_URL}/posts/${index}`);
    res.redirect("/index");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});
app.get('/blog/:id', async (req, res) => {
  const index=(req.params.id)
  const response = await axios.get(`${API_URL}/posts/${index}`)

  const blogPost = (response.data);
  res.render('blog.ejs', { title: blogPost.title, content: blogPost.content });

});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
const mongoose = require('mongoose');
const Blog = require('../models/blogreview');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./testHelper');

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});

test('bloglist is returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200).expect('Content-Type', /application\/json/);
});

test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('returned blog identifier should be defined as "id"', async () => {
    const response = await api.get('/api/blogs/');
    expect(response.body[0].id).toBeDefined();
});

test('adding a new blog succesfully', async () => {
    const newBlog =
        { 'author': 'Supertest Blog', 'likes': 777, 'title': 'Supertest Blogzone', 'url': 'http://www.testtest.test' };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map(b => b.author);
    expect(contents).toContain('Supertest Blog');
});

afterAll(() => {
    mongoose.connection.close();
});
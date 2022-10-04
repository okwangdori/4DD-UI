import Post from './models/post.js';

export default function createFakeData(){
    const posts = [...Array(40).keys()].map(i => ({
        title: `포스트 #${i}`,
        body: 
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tem-por incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
        tags: ['가짜', '데이터']
    }));
    Post.insertMany(posts, (err, docs) => {
        console.log(docs);
    });
}
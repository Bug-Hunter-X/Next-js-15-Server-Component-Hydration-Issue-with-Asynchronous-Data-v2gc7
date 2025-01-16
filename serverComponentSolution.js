//serverComponentSolution.js
import { unstable_getServerSession } from 'next-auth' //If using next auth
import { authOptions } from './api/auth/[...nextauth]' //import authOptions

export default async function ServerComponent(props) {
  const session = await unstable_getServerSession(props.req, props.res, authOptions)//If using next auth

  //Simulate an API call that returns a promise and could fail
  const data = await fetchData().catch(error => {
    console.error('Error fetching data:', error)
    // Return a default value or handle the error appropriately
    return { posts: [] }
  })

  //Check data structure before rendering
  if (!data || !data.posts) {
    return <div>Error loading data</div> 
  }

  // Ensure data is in the correct format before sending to the client
  const formattedData = data.posts.map(post => ({ ...post, id: String(post.id) })); //Handle ID type mismatch

  return (
    <div>
       {formattedData.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

async function fetchData() {
  // Simulate a fetch call
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) {
    throw new Error(`Error! status: ${res.status}`);
  }

  return res.json();
}
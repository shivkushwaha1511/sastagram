import axios from "axios";
import { useContext, useEffect } from "react";
import Post from "../components/cards/Post";
import { UserContext } from "../context";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

const Home = ({ data }) => {
  const [state, setState] = useContext(UserContext);

  // SOCKET
  const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
    reconnection: true,
  });

  // Socket Broadcasting Example
  useEffect(() => {
    socket.on("receive-message", (msg) => {
      alert(msg);
    });
  }, []);

  const head = () => (
    <Head>
      <title>SastaGram-Do masti with dogs</title>
      <meta name="description" content="Have masti with dogs" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="sastagram" />
      <meta property="og:url" content="http://localhost:3000" />
      <meta property="og:description" content="Have masti with dogs" />
      <meta
        property="og:image:secure_url"
        content="http://localhost:3000/images/default.jpg"
      />
    </Head>
  );

  return (
    <>
      <button
        class="btn btn-primary"
        onClick={() => socket.emit("send-message", "Hi! My name is shiv")}
      >
        Send Message
      </button>
      {head()}
      <div className="container-fluid home-img text-center text-warning">
        SastaGram
      </div>
      <div className="container-fluid">
        <div className="row pt-5">
          {data.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link href={`/post/${post._id}`}>
                <a>
                  <Post post={post} home={true} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("/all-posts");

  return {
    props: { data },
  };
}

export default Home;

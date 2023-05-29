import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import { ContextState } from "../Context/ContextProvider";
import UploadModal from "../components/UploadModal";
import { CircularProgress, TextField } from "@mui/material";
export default function Main() {
  const { userToken, user } = ContextState();

  const [searchImg, setSearchImg] = useState<string>("");
  const [searchImgLoading, setSearchImgLoading] = useState(false);
  const [uploadImg, setUploadImg] = useState<File>();
  const [uploadImgName, setUploadImgName] = useState<string>("");

  const [postLoading, setPostLoading] = useState(false);
  const [posts, setPosts] = useState<[{ name: string; url: string }]>();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      setPostLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_BASE_ADDR}/post`,
        config
      );

      setPosts(data.posts);
      setPostLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setPostLoading(false);
    }
  };

  const searchImage = async () => {
    console.log("Search Image");
    if (searchImg === "") {
      // Toast Here
      console.log("No Image Name Selected");
      return;
    }
    try {
      setSearchImgLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_APP_SERVER_BASE_ADDR
        }/post/search?name=${searchImg}`,
        config
      );
      // console.log(data.posts);
      setSearchImg("");
      setPosts(data.posts);
      setSearchImgLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setSearchImgLoading(false);
    }
  };

  const postImage = async () => {
    console.log("Post Image");
    const pic = uploadImg;

    if (pic === undefined || pic === null) {
      //  Toast Here
      console.log("No Image Selected");
      return;
    }

    if (uploadImgName === "") {
      // Toast Here
      console.log("No Image Name Selected");
      setUploadImg(undefined);
      return;
    }

    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/jpg"
    ) {
      setImageLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "social-media");
      data.append("cloud_name", "dczilkqlt");
      fetch("https://api.cloudinary.com/v1_1/dczilkqlt/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (dataUrl) => {
          // setPostImageUrls([...postImageUrls, dataUrl.url.toString()]);
          console.log(dataUrl.url.toString());
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            };
            setPostLoading(true);
            const { data } = await axios.post(
              `${import.meta.env.VITE_APP_SERVER_BASE_ADDR}/post`,
              { name: uploadImgName, url: dataUrl.url.toString() },
              config
            );
            console.log(data);
            // setPosts(data.post);
            setUploadImg(undefined);
            setFetchAgain(!fetchAgain);
            setUploadImgName("");
            setPostLoading(false);
          } catch (error: any) {
            console.log(error.message);
            setPostLoading(false);
          }
          setImageLoading(false);
          console.log("Image Uploaded Successfully!!");
        })
        .catch((err: unknown) => {
          //Toase Here
          console.log("Unable to post image", err);
          setImageLoading(false);
        });
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [fetchAgain]);
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            {user?.user.name}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: "auto" }}
            onClick={() => {
              localStorage.removeItem("userToken");
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album
            </Typography>

            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <UploadModal type="upload" text="Upload Image" action={postImage}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Image Name"
                  value={uploadImgName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUploadImgName(e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadImg(e.target.files[0]);
                    }
                  }}
                />
              </UploadModal>
              <UploadModal
                type="search"
                text="Search Image"
                action={searchImage}
              >
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Search Image Name"
                  value={searchImg}
                  onChange={(e) => setSearchImg(e.target.value)}
                />
              </UploadModal>
              <Button
                variant={"outlined"}
                onClick={() => {
                  fetchPosts();
                  setFetchAgain(!fetchAgain);
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {postLoading || imageLoading || searchImgLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {posts?.map((post, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={post.url}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
}

"use client";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import PrestappLogo from "../../../public/logos/PrestappLogo";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { data: session, status: statusSession } = useSession();
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsLogged(statusSession === "authenticated");
  }, [statusSession]);

  useEffect(() => {
    if (session?.user && isLogged && user === null) {
      fetch(`/api/user/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [session?.user, isLogged, user]);

  if (!isLogged) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#d4ffd8",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <PrestappLogo width={100} />
          </Link>
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Button color="primary">
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
          </Button>
          <Button
            color="primary"
            sx={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "-14px",
            }}
            onClick={handleClick}
          >
            <Typography
              sx={{
                fontSize: "14px",
              }}
            >
              {user ? user?.name : session?.user?.email}
            </Typography>
            {user?.email && (
              <Typography
                sx={{
                  fontSize: "10px",
                  textTransform: "none",
                }}
              >
                ({user?.email})
              </Typography>
            )}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

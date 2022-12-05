import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./board.scss";
import Button from '@material-ui/core/Button';
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import BoardService from "../../services/board";

// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
// ];
const columns: GridColDef[] = [
  { field: 'index', headerName: '#', width: 80, headerAlign: "center", align: "center", },
  { field: '_id', headerName: '아이디', hide: true},
  { field: 'title', headerName: '제목', width: 1000, headerAlign: "center"},
  { field: 'userName', headerName: '닉네임', width: 200, headerAlign: "center", align: "center"},
  { field: 'dateTimeOfPosting', headerName: '작성일', width: 200, headerAlign: "center" }
];

function Board() {
  const [rows, setRows] = useState([]);
  let navigate = useNavigate();  

  useEffect(() => {
    // 게시판 불러오기
    BoardService.getPosts()
    .then(
      response => {
        let data = response.data.data;
        data.map((key: any, idx: number) => {          
          key.index = ++idx;
        })
        
        setRows(data);
      },
      error => {
        const resMessage = error.response.data?.message;
      }
    );
    
  }, []);

  const getPost = (e: any) => {
    // console.log("### get id "+ JSON.stringify(e.id));
    // console.log("### get row "+ JSON.stringify(e.row));

    // navigate('/board/post/' + e.id);
    navigate('/board/post/', {state: e.row});
    
  }
  return (
    <body id="board">
      <Navbar />
      <h1>자유게시판</h1>
      <div className="grid_container">
        <div className="grid_component">
          <DataGrid getRowId={(row) => row._id} onRowClick={getPost} rows={rows} columns={columns} />
        </div>
      </div>
      <div className="grid_button">
      <Link to="/board/post">
        <Button variant="contained" color="primary" style={{ width: '150px'}}>
          작성하기
        </Button>
      </Link>
      </div>

      <footer className="footer">
        <p className="footer-by">
          A project by{" "}
          <a
            href="https://naver.com/"
            rel="noopener"
            className="small-link"
          >
            HWI ONE
          </a>
          <a
            href="https://naver.com/"
            rel="noopener"
            target="_blank"
            className="no-link icon-twitter"
            aria-label="Follow me on Twitter"
          ></a>
        </p>
      </footer>
    </body>
  );
}

export default Board;

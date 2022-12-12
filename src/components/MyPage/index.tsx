import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./mypage.scss";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "../../common/Carousel";

function MyPage() {
  let navigate = useNavigate();  

  const propFunc = (title:string) => {
    type pType = {
      list : string[],
      option : string,
      title : string
    };

    let option = 'list';
    let arr: string[];

    //TODO : DB에서 가져오는걸로 바꿔야함
    let contents: string[] = ["네트워크", "운영체제", "알고리즘"];
    let companies: string[] = ["삼성전자", "넥슨", "네이버", "넷마블", "엔씨소프트", "카카오"];
    let interviews: string[] = ["배달의민족", "네이버", "SK하이닉스", "GS칼텍스"];

    if(title == '내 컨텐츠'){
      arr = contents;
    }else if(title == '관심 회사'){
      arr = companies;
    }else if(title == '모의면접 진행'){
      arr = interviews;
    }else{
      arr = [];
    }

    let props: pType = {
      list : arr, 
      option : option,
      title : title
    };

    return props;
  };

  // useEffect(() => {
  //   // 게시판 불러오기
  //   BoardService.getPosts()
  //   .then(
  //     response => {
  //       let data = response.data.data;
  //       data.map((key: any, idx: number) => {          
  //         key.index = ++idx;
  //       })
        
  //       setRows(data);
  //     },
  //     error => {
  //       const resMessage = error.response.data?.message;
  //     }
  //   );
    
  // }, []);

  return (
    <body id="mypage">
      <Navbar />
      <div style={{marginTop: '70px'}}></div>
      <Carousel {...propFunc('내 컨텐츠')}/>      
      <Carousel {...propFunc('관심 회사')}/>
      <Carousel {...propFunc('모의면접 진행')}/>
      {/* <div>
        <div>
          공지사항
        </div>
        <div>
          Q & A
        </div>
      </div> */}
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

export default MyPage;

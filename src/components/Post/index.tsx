import React, { useState } from 'react';
import Navbar from "../Navbar";
import "./post.scss";
import Button from '@material-ui/core/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link, useNavigate, useLocation } from "react-router-dom";
import EditorComponent from "../Utils/index"
import { Formik, Field, Form, ErrorMessage } from "formik";
import BoardService from "../../services/board";
import * as Yup from "yup";
import ReactQuill, { Quill } from 'react-quill';


function Post() {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pureContent, setPureContent] = useState('');
  const [isSwitch, setIsSwitch] = useState(false);
  const getContent = (content: string) => {
    setPureContent(content.replace(/<[^>]*>?/g, ''));
    setContent(content);
  }
  const [open, setOpen] = useState(false);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const userInfo:any = localStorage.getItem('user');
  const userInfoObj = JSON.parse(userInfo);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const editChange = (event: React.ChangeEvent<HTMLInputElement>) => {        
    setIsSwitch(event.target.checked);
  };
  
  let navigate = useNavigate();  
  
  const { state } = useLocation();
  
  // Submit 핸들러
  const handleSubmit = (formValue: { title: string }) => {  
    const { title } = formValue;     
    const userName = userInfoObj.name;
    
    if(!title) {
      setMessage("계정 정보를 입력해 주세요.");
      return;
    } 
    BoardService.register(      
      userName,
      title,
      content
    ).then(
      response => {
        setSuccessful(true);
        setMessage(response.data);
        navigate('/board');
      },
      error => {
        const resMessage = error.response.data?.message;
        setSuccessful(false);
        setMessage(resMessage);
      }
    );
  }

  // 포스트 삭제
  const deletePost = () => {      
    setOpen(true);
    const _id = state._id;    
    BoardService.delete(      
      _id
    ).then(
      response => {     
        setSuccessful(true);
        setMessage(response.data);
        navigate('/board');
      },
      error => {
        const resMessage = error.response.data?.message;
        setSuccessful(false);
        setMessage(resMessage);
      }
    );
  }

  // Yup을 이용한 Form 제한조건
  const validationSchema = () => {      
    return Yup.object().shape({
      title: Yup.string()
        .required("제목을 입력해주세요.")
        .test(
          "len",
          "제목은 1 ~ 30 글자로 입력해주세요.",
          (val: any) => (         
            val &&
            val.toString().length >= 1 &&
            val.toString().length <= 30            
          )
        )
    });
  }

  const initialValues = {    
    title: "",
    content: "",
  };
  return (
    <body id="post">
      <Navbar />
      <h1>Post</h1>      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >        
        {(props) => {
          const {
            values,		// form에서 공유되는 상태 값
            touched, 	// 사용자의 필드 방문/터치 여부 (boolean)
            errors, 		// form validation 에러
            isSubmitting,	// form 제출 상태 (boolean)
            handleChange,	// input change event handler. values[key] 를 업데이트
            handleBlur,	// onBlur event handler
            handleSubmit	// submit handler
          } = props;
          return (
            <Form>
              {(!state || isSwitch) ? (
              <div>                
                {(userInfoObj.name === state.userName) && (
                  <div className='post_switch_box'>
                    <div className='post_switch'>
                      <Switch
                        onChange={editChange}
                        {...label}
                      />
                    </div>
                    <div className='post_edit'>EDIT</div>
                  </div>
                )}                
                <div className="title_container">
                  <Field 
                    name="title" 
                    type="title"
                    placeholder="제목을 30글자 이내로 입력해주세요."
                  />
                </div>
                <div className="editor_container">
                  <EditorComponent
                    getContent={getContent}
                    contents = {state.content}
                  />
                </div>
                <div className="grid_button">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    style={{ width: '150px'}}
                    disabled={!(pureContent && values.title) || values.title.length > 30}
                  >
                    작성하기
                  </Button>
                </div>
              </div>
              ) 
              :
              (
                <div className='post_container'>
                {(userInfoObj.name === state.userName) && (
                  <div className='post_switch_box'>                    
                    <div className='post_switch'>
                      <Switch
                        onChange={editChange}
                        {...label}
                      />
                    </div>
                    <div className='post_edit'>EDIT</div>
                  </div>
                )}
                <div className='post_component'>
                  <div>
                    <div className='post_title_box'>
                      <div className='post_title'>
                        {state.title}
                      </div>
                    </div>
                    <hr/>
                    <div>
                      <ReactQuill readOnly className='post_quill' value={state.content}></ReactQuill> 
                    </div>
                  </div>
                </div>
                {(userInfoObj.name === state.userName) && (
                  <div className="grid_button edit">
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      disabled={!(pureContent && values.title) || values.title.length > 30}
                    >
                      수정
                    </Button>
                    <Button 
                      className="btn_delete"             
                      variant="contained"   
                      onClick={handleClickOpen}                
                    >
                      삭제
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {state.title}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          해당 게시물을 삭제하시겠습니까?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button style={{fontWeight: 'bold', color: '#ffffff', background: '#FF3636'}} onClick={handleClose}>취소</Button>
                        <Button style={{fontWeight: 'bold', color: '#ffffff', background: 'seagreen'}} onClick={deletePost} autoFocus>
                          확인
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
              </div>
              )
            }
            </Form>
          )
        }}
      </Formik>
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

export default Post;

import React, { useEffect, useState} from 'react';
import "./comment.scss";
import { Grid, TextField } from "@material-ui/core";
import { Reply, Edit, Delete } from "@material-ui/icons";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../modules";
import Button from '@mui/material/Button';
import { setButtonType } from '../../modules/commentModule';
import NestedModal from "../Common/modal";

type ModalForm = {
  title: string;
  content: string;
  _id: string;
  type: string;
  callback: any;
}

type CommentForm = {
  childComment: any;
  content: string;
  dateTimeOfComment: string;
  parentsComment: any;
  post_id: string;
  userName: string;
  _id: string;
}

const Comment = ({comInfo, isChild}:any) => {  
  const [comment, setComment] = useState('');
  const [updateCmt, setUpdateCmt] = useState('');
  const [replyCmt, setReplyCmt] = useState('');
  const userInfo = useSelector((state: RootState) => state.user.info);  
  const { name, email, id }: any = userInfo;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalForm, setModalForm] = useState<ModalForm>({
    title: '',
    content: '',
    _id: '',
    type: '',
    callback: null
  });
  const [tagComment, setTagComment] = useState<JSX.Element[]>([]);
  // 댓글 수정 Editor Open
  const openEditor = (type: string, _id: string) => {
    if(type === 'edit'){
      updateCmt === _id ? setUpdateCmt('') : setUpdateCmt(_id);
    }else{
      replyCmt === _id ? setReplyCmt('') : setReplyCmt(_id);
    }
  }

  useEffect(() => {
    setComment(comInfo.content)
    tagFunc();  
  },[comInfo]);

  // 댓글 버튼 controller
  const commentSubmit = (type: string, _id: string) => {   
    if(type === 'add'){
      dispatch(setButtonType({type: type, content: comment, selectedId: _id}));
      setUpdateCmt('');
      setReplyCmt('');
      return;
    } 
    const buttonType = type === 'edit' ? '수정' : '삭제'; 
    setModalForm({
      title: '댓글 '+buttonType,
      content: '해당 댓글을 '+buttonType+'하시겠습니까?',
      _id: _id,
      type: type,
      callback: {callbackfunc}
    })   
    setOpenModal(true);
  } 

  // 댓글 입력내용
  const fieldContent = (e: any, userName: string) => {
    let tmp = '';
    userName && (tmp = '@'+userName+' ');
    setComment(tmp+e.target.value);
  }

  // modal callback 함수
  const callbackfunc = (prop: any) =>{
    setOpenModal(false);
    if(prop === 'cancel')return;  
    dispatch(setButtonType({type: prop.type, content: comment, selectedId: prop._id}));
    setUpdateCmt('');
    setReplyCmt('');
  } 

  // 댓글 트리구조 만들기
  let innerHtml: JSX.Element[] = [];
  const tagFunc = () => {     
    const reg = new RegExp(/^@.*?\s/,'g');
    let tagName = [...comInfo.content.matchAll(reg)];
    if(tagName.length > 0){
      let con = '';
      tagName = tagName[0][0];
      con = comInfo.content.split(tagName)[1];
      innerHtml.push(
        <div key={comInfo._id}>
          <p style={{ marginRight:'10px', textAlign: "left", color: 'royalblue' }}>{tagName}</p>
          <p>{con}</p>
        </div>
      );
    }else{
      innerHtml.push(
        <div key={comInfo._id}>
          <p>{comInfo.content}</p>
        </div>
      );
    }
    setTagComment(innerHtml);
  };
    
  
  return (
    <>
        <div className={isChild ? 'tab' : ''} id="comment" key={comInfo._id}>
          {!comInfo.isDeleted ?
            <div style={{padding: '10px'}}>
              {openModal && <NestedModal props={modalForm}/>}          
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  {/* <Avatar alt="Remy Sharp" /> */}
                </Grid>
                <Grid item xs zeroMinWidth>
                  <div className='comment_title'>
                    <div className='comment_title_name'>
                      <h4 style={{ margin: 0, textAlign: "left" }}>{comInfo.userName}</h4>                
                      <p>
                        {comInfo.dateTimeOfComment}
                      </p>
                    </div>
                    {(comInfo.userName === name) ? (
                      <div className='comment_title_btn'>
                        {/* <Reply fontSize='small' style={{ color: 'cadetblue'}} onClick={() => openEditor('reply', comInfo.id)}/>                           */}
                        <Edit fontSize='small' style={{ color: 'mediumseagreen'}} onClick={() => openEditor('edit', comInfo._id)}/>
                        <Delete fontSize='small' style={{ color: 'tomato'}} onClick={() => commentSubmit('delete', comInfo._id)}/>                    
                      </div>
                    ) : (
                      <div className={userInfo.id ? 'comment_title_btn' : ''}>
                        {userInfo.id &&
                          <Reply fontSize='small' style={{ color: 'cadetblue'}} onClick={() => openEditor('reply', comInfo._id)}/>
                        }
                      </div>
                    )}
                  </div>                           
                  {updateCmt === comInfo._id ? (
                    <div>
                      <div className='textfield_container_edit'>
                        <TextField
                          className='textfield_field'
                          variant="outlined"
                          multiline
                          minRows={3}
                          onChange={(e) => fieldContent(e, '')}
                          defaultValue={comInfo.content}
                        />
                      </div>
                      <div className='textfield_button_edit'>
                        <Button className={(comment.length === 0) ? 'disabled' : ''} disabled={comment.length === 0}
                         variant="contained" onClick={() => commentSubmit('edit', comInfo._id)}>수정</Button>          
                      </div>  
                    </div>
                  ) : 
                    <>
                      {tagComment}
                    </>
                  }
                  {replyCmt === comInfo._id && (
                  <div>
                    <div className='textfield_container_edit'>
                      <TextField
                        className={'textfield_field'}
                        variant="outlined"
                        multiline
                        minRows={3}
                        onChange={(e) => fieldContent(e, comInfo.userName)}
                      />
                    </div>
                    <div className='textfield_button_reply'>
                      <Button variant="contained" onClick={() => commentSubmit('add', comInfo._id)}>댓글 +</Button>          
                    </div>  
                  </div>
                  )}    
                </Grid>
              </Grid>
              <hr className='textfield_line'/>
              {/* <Divider variant="fullWidth" style={{ margin: "30px 0" }} /> */}
            </div>
          :
           <div style={{padding: '10px'}}>
              <div className="textfield_delete" key={comInfo._id}>삭제된 댓글입니다.</div>
              <hr className='textfield_line'/>
            </div>
          }
        </div>
    </>
  );
}

export default Comment;

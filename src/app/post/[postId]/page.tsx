"use client"
import styles from '@/app/page.module.css'
import { ChangeEvent, useEffect, useState } from 'react';
import { TPost } from '../page';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostDetails = ({ params }: { params: { postId: string } }) => {

    const [singlePost, setSinglePost] = useState<TPost>();
    const postId = params.postId;
    const [inputState, setInputState] = useState({ title: "", description: "" })

    const fetchPost = async () => {
        const res = await fetch(`http://localhost:3000/post/api/${postId}`);
        const data = await res.json();
        console.log(data)
        setSinglePost(data.data);
    }

    useEffect(() => {
        fetchPost();
    }, [postId]);

    // Cập nhật inputState khi singlePost thay đổi
    useEffect(() => {
        if (singlePost) {
            setInputState({
                title: singlePost.title || "",
                description: singlePost.description || ""
            });
        }
    }, [singlePost]);

    const handleUpdatePost = async () => {
        const res = await axios.put(`/post/api/${postId}`, inputState);
        const data = await res.data;
        if (data.EC === 0) {
            setSinglePost(data);
            fetchPost();
            toast.success(data.EM)
        } else {
            toast.error(data.EM)
        }

    }

    const handleOnchangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.value
        })
    }
    return (
        <main className={styles.main}>
            <div className='col-md-6'>
                <div>
                    <label className="form-label">Title: </label>
                    <input
                        type="text"
                        value={inputState.title}
                        onChange={handleOnchangeInput}
                        className="form-control"
                        name='title'
                    />
                </div>
                <div>
                    <label className="form-label">Descrpition: </label>
                    <input
                        type="text"
                        value={inputState.description}
                        onChange={handleOnchangeInput}
                        className="form-control"
                        name='description'
                    />
                </div>
                <div>
                    <Button variant="success" onClick={handleUpdatePost} >Save</Button>
                </div>
            </div>
            <div>
                <h1>Details posts</h1>
                <h2>Id: {singlePost?._id}</h2>
                <h2>Title: {singlePost?.title}</h2>
                <h2>Description {singlePost?.description}</h2>
            </div>

        </main>
    )
}

export default PostDetails;
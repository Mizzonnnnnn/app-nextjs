"use client"
import styles from '@/app/page.module.css'
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from '@/utils/axiosInstance'
import { title } from 'process';

export interface TPost {
    title: string,
    description: string,
    _id: string
}

const ListPost = () => {
    const LIMIT = 2;
    const [listPost, setListPost] = useState<TPost[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [inputState, setInputState] = useState({title: "", description: ""})


    const fetchListPost = async () => {
        const res = await axios.get(`/post/api?limit=${LIMIT}&page=${currentPage + 1}`);
        const data = await res.data;
        setListPost(data.data);
        setPageCount(data.pagination.totalPage)
    }

    useEffect(() => {
        fetchListPost();
    }, [currentPage]);


    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    const handleDelete = async (idd: string) => {
        const res = await axios.delete(`/post/api/${idd}`, { method: "DELETE" })
        const data = await res.data;
        if (data.EC === 1) {
            toast.success(data.EM);
            fetchListPost();
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

    const handleCreatePost = async () => {
        const res = await axios.post(`/post/api`, inputState);
        const data = res.data;
        try {
            if (data.EC === 0) {
                toast.success(data.EM);
                fetchListPost();
                setInputState({ title: "", description: "" });
            }
            if (data.EC === 1) {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Failed to create post");
        }
    };

    return (
        <main className={styles.main}>
            <div>
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
                        <Button variant="success" onClick={handleCreatePost}>Save</Button>
                    </div>
                </div>
                <h1>List posts</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPost.map((item: TPost) => {
                            return (
                                <tr key={item._id}>
                                    <td><Link href={`/post/${item._id}`}> {item._id}</Link></td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>
        </main>
    );
}

export default ListPost;

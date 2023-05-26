import React from 'react'
import { useState } from 'react'

const CategoryForm = (props: any) => {
    const [name, setName] = useState<any>(props.editCategory ? props.editCategory.name : '')
    const handleSubmit = (e: any) => {
        e.preventDefault()
        props.formSubmit({ name })
    }

    return (
        <>
            <div className="add-category-form rounded col-xl-4 py-2 gap-2 bg-white row">
                <h1 className='text-center'>{props.title}</h1>
                <form onSubmit={handleSubmit} className='d-flex p-0 flex-column gap-2 col-xl-12'>
                    <input value={name} type="text" onChange={(e) => setName(e.target.value)} autoFocus placeholder='Category Name' className='form-control' />
                    <button disabled={props.isSubmitting || !name} className='btn btn-primary'>{props.isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : props.btnTitle}</button>
                    {props.editCategory && <button disabled={!name || props.isDeleting} onClick={props.onDelete()} className='btn btn-danger' >Delete Category </button>}
                </form>
                {props.error && <p className='alert alert-danger'>{props.error}</p>}
                {props.success && <p className='alert alert-success'>{props.success}</p>}
            </div>
        </>
    )
}

export default CategoryForm
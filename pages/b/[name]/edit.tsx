export default function BiotopeEditPage() {

    const onSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("logoImage", e.target.logoImage.files[0]);
        const res = await fetch(window.location.origin + '/api/file/upload', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "type": "formData",
            },
            body: fd
        });
        console.log('file upload result', res)
    };

    return <form encType="multipart/form-data" onSubmit={onSubmit}>
        <input name="logoImage" type="file" />
        <button>Submit</button>
    </form>
}
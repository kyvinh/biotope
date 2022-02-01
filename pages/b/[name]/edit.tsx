import {useForm} from "react-hook-form";
import {fetcher} from "../../../components/util/fetcher";

export default function BiotopeEditPage() {

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        const res = await fetcher(`/api/file/upload`, data);
        console.log(res)
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("mainLogo")} type="file" />
        <button>Submit</button>
    </form>
}
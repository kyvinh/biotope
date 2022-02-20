import React, {useState} from "react";
import {fetcher} from "./util/fetcher";

export const EmailJoinForm = () => {

    const [codeError, setCodeError] = useState('')
    const [success, setSuccess] = useState(false)

    const onCodeSubmit = async (event) => {
        event.preventDefault()
        const email = event.target.email.value

        const res = await fetcher(`/api/user/saveEmail`, { email });
        if (res?.status == 'ok') {
            setSuccess(true)
        }
    }

    return <form className="row row-cols-sm-auto mt-1 g-2 align-items-center" onSubmit={onCodeSubmit}>
        {!success && <>
            <div className="col-12">
                <input name="email" id="email" type="email" required
                       className={`form-control ${codeError ? 'is-invalid' : ''}`}/>
            </div>
            <div className="col-12">
                <button type="submit" className="btn btn-primary">Enregistrer</button>
            </div>
        </>
        }
        {success && <div className="col-12 lead">
            Merci pour votre inscription. Vous recevrez des nouvelles par email.
        </div>
        }
    </form>
}
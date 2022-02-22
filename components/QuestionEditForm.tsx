import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Controller} from "react-hook-form";
import {addDays} from "date-fns";
import messages from "../lib/messages.fr";

const DEFAULT_DAYS_ADDED_CLOSING_DATE = 14;

export default function QuestionEditForm({  register,
                                             errors,
                                             questionId = 'new',
                                             control,
                                            defaultValues = { name: undefined, description: undefined, closingDate: addDays(new Date(), DEFAULT_DAYS_ADDED_CLOSING_DATE)}}
) {

    return <>
        <div className="input-box">
            <label htmlFor={`question-${questionId}-name`}>{messages.question["edit-question-label"]}</label>
            <div className="label-text">{messages.question["edit-question-info"]}</div>
            <div className="form-group">
                <input id={`question-${questionId}-name`} className={`form-control form--control ${errors.name ? 'is-invalid' : ''}`}
                       defaultValue={defaultValues.name}
                       {...register("name", {required: true})} />
                <div className="invalid-feedback">{messages.question["edit-question-error"]}</div>
            </div>
        </div>
        <div className="input-box">
            <label htmlFor={`question-${questionId}-description`}>{messages.question["edit-description-label"]}</label>
            <div className="label-text">{messages.question["edit-description-info"]}</div>
            <div className="form-group">
                <textarea className={`form-control form--control ${errors.description ? 'is-invalid' : ''}`} id={`question-${questionId}-description`}
                          rows={3} {...register("description", {required: true})} defaultValue={defaultValues.description} />
                <div className="invalid-feedback">{messages.question["edit-description-error"]}</div>
            </div>
        </div>
        <div className="input-box">
            <label>{messages.question["edit-closing-date-label"]}</label>
            <div className="label-text">{messages.question["edit-closing-date-info"]}</div>
            <Controller
                render={
                    ({ field }) => <Calendar {...field} next2Label={null} prev2Label={null} />
                }
                control={control}
                name="closingDate"
                defaultValue={new Date(defaultValues.closingDate) || addDays(new Date(), DEFAULT_DAYS_ADDED_CLOSING_DATE)}
            />
        </div>
    </>
}
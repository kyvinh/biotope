import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Controller} from "react-hook-form";
import {addDays} from "date-fns";


export default function QuestionEditForm({
                                             register, errors, questionId = 'new', control,
                                             defaultValues = { name: undefined, description: undefined, closingDate: undefined}}
) {

    return <>
        <h6>Description</h6>
        <div className="form-group">
            <label htmlFor={`question-${questionId}-name`}>Your question:</label>
            <div className="form-text">Your question should be short and precise. More context should be added in the description below.</div>
            <input id={`question-${questionId}-name`} className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                   defaultValue={defaultValues.name}
                   {...register("name", {required: true})} />
            <div className="invalid-feedback">Please specify your question here.</div>
        </div>
        <div className="form-group">
            <label htmlFor={`question-${questionId}-description`}>Complete description:</label>
            <div className="form-text">Your description should provide enough context to make an informed choice, or to suggest one.</div>
            <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id={`question-${questionId}-description`}
                      rows={3} {...register("description", {required: true})} defaultValue={defaultValues.description} />
            <div className="invalid-feedback">A description is required.</div>
        </div>
        <div>
            <Controller
                render={
                    ({ field }) => <Calendar {...field} next2Label={null} prev2Label={null} />
                }
                control={control}
                name="closingDate"
                defaultValue={new Date(defaultValues.closingDate) || addDays(new Date(), 14)}
            />
        </div>
    </>
}
const fs = require('fs');
import Navbar from "../../../components/Navbar";
import { PrismaClient } from '@prisma/client'
import { parseCookies } from "../../../library/cookie";
import jwt from '../../../library/jwt';
import styles from './../../../styles/Page.module.scss';
import { useState } from "react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ _questionnaire, _json }) {

    const [json, setJson] = useState(_json)
    const [questionnaire, setQuestionnaire] = useState(_questionnaire)

    const onSave = (event) => {
        event.preventDefault()

        let answers = []

        questionnaire['questions'].forEach((question, index) => {

            question['answers'].forEach(answer => {
                console.log(event.target.elements[index + "-" + answer['titel']])
            })
        })

        

        let questionnaireIndex = _json['checked'].findIndex((item) => item['titel'] == questionnaire['id'])

        if (questionnaireIndex) {
            _json['checked'][questionnaireIndex] = {

            }
        }
        else {
            _json['checked'].push({
                "titel": questionnaire['id'],
                "type": "questionnaire",
                "answers": []
            })
        }


        
    }
    function answerExists() {

    }

    return (
        <main>
            <Navbar/>

            <h1>{_questionnaire.titel}</h1>

            <div className={styles.container}>
                <form onSubmit={onSave}>
                    <div className={styles.question_list}>
                        {questionnaire['questions'].map((question, index) => 
                            <div className={styles.question_item}>
                                <h3>{question.titel}</h3>
                                <div className={styles.answers_list}>
                                    {question['answers'].map((answer, _index) =>
                                        <div key={_index} className={styles.answer_item}>
                                            <input type="radio" id={index + "-" + answer['titel']} name={index + "-" + answer['titel']} value={answer['titel']}/>
                                            <label htmlFor={index + "-" + answer['titel']}>{answer['titel']}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" className={styles.button}>
                        Antworten speichern
                    </button>
                </form>
            </div>
        </main>
    )
}


export async function getServerSideProps(context) {

    const prisma = new PrismaClient()

    const { accessToken } = parseCookies(context.req)

    let user = await jwt.verifyAccessToken(accessToken)
    
    // Daten laden
    let questionnaires = fs.readFileSync(process.cwd() + '/data/frageboegen.json', {encoding:'utf8'});

    user = await prisma.users.findUnique({
        where: {
            id: user.payload.id
        }
    })

    await prisma.$disconnect();

    questionnaires = JSON.parse(questionnaires)['questionnaires']

    let questionnaire = questionnaires.find((obj) => obj.id == context.params.id)

    return {
        props: {
            _questionnaire: questionnaire ? questionnaire : null,
            _json: JSON.parse(user.json),
            user: user
        }
    }
}
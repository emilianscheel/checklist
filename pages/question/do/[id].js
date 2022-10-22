const fs = require('fs');
import Navbar from "../../../components/Navbar";
import { PrismaClient } from '@prisma/client'
import { parseCookies } from "../../../library/cookie";
import jwt from '../../../library/jwt';
import styles from './../../../styles/Page.module.scss';
import { useState } from "react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ _questionnaire }) {

    const [questionnaire, setQuestionnaire] = useState(_questionnaire)

    return (
        <main>
            <Navbar/>

            <h1>{_questionnaire.titel}</h1>

            <div className={styles.container}>
                <div className={styles.question_list}>
                    {questionnaire['questions'].map((question, index) => 
                        <div className={styles.question_item}>
                            <h3>{question.titel}</h3>
                            <div className={styles.answers_list}>
                                {question['answers'].map((answer, _index) =>
                                    <div className={styles.answer_item}>
                                        <input type="radio" id={answer['titel']} name={question['titel']} value={answer['titel']}/>
                                        <label for={answer['titel']}>{answer['titel']}</label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
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
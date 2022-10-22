const fs = require('fs');
import Navbar from "./../../components/Navbar";
import { PrismaClient } from '@prisma/client'
import { parseCookies } from "./../../library/cookie";
import jwt from './../../library/jwt';
import styles from './../../styles/Page.module.scss';
import { useState } from "react";
import Link from "next/link";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ _questionnaires }) {

    const [questionnaires, setQuestionnaires] = useState(_questionnaires)

    const onSubmitSearch = (event) => {
        event.preventDefault()

        const search_string = event.target.elements.search_string.value.toLowerCase()

        const filtered = _questionnaires['questionnaires'].filter(question => {
            return search_string.includes(question.titel.toLowerCase()) || 
                question.titel.toLowerCase().includes(search_string)
            })


        setQuestionnaires({..._questionnaires, "questionnaires": filtered})
    }

    return (
        <main>
            <Navbar/>

            <h1>Fragebögen</h1>

            <div className={styles.container}>
                <div className={styles.search_container}>
                    <form onSubmit={onSubmitSearch}>
                        <input name="search_string" placeholder="Suchbegriff eingeben + ENTER"/>
                        <button type="submit">
                            <span className="material-symbols-outlined">
                                search
                            </span>
                        </button>
                    </form>
                </div>

                <div className={styles.questionnaires_list}>
                    {questionnaires['questionnaires'].map((questionnaire, index) => 
                        <div key={index} className={styles.questionnaire_item}>
                            <div className={styles.left}>
                                <h2>{questionnaire.titel}</h2>
                                <p>{questionnaire.questions.length} Fragen</p>
                            </div>
                            <div className={styles.right}>
                                <Link href={"/question/do/" + questionnaire.id}>
                                    <button>
                                        Starten
                                    </button>
                                </Link>
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
    const questionnaires = fs.readFileSync(process.cwd() + '/data/frageboegen.json', {encoding:'utf8'});

    user = await prisma.users.findUnique({
        where: {
            id: user.payload.id
        }
    })

    await prisma.$disconnect();

    return {
        props: {
            _questionnaires: JSON.parse(questionnaires),
            _json: JSON.parse(user.json),
            user: user
        }
    }
}
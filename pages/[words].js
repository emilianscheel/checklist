const fs = require('fs');
import styles from './../styles/Page.module.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ _data, _level, words }) {

    const [data, setData] = useState(_data)
    const [level, setLevel] = useState(_level)
    const [showPassword, setShowPassword] = useState(false)

    function strokeDasharray(val) {
        let _val = val;
        let c = Math.PI*(10*2);
   
        if (_val < 0) { _val = 0;}
        if (_val > 100) { _val = 100;}
        
        let pct = ((100-_val)/100)*c;
        return pct
    }
    function getFullPercentage() {
        let sum = 0;
        data['bereiche'].forEach(bereich => sum = sum + bereich['tätigkeiten'].length)
        let sumChecked = 0
        data['bereiche'].forEach((bereich) => bereich['tätigkeiten'].forEach((tätigkeit) => tätigkeit['checked'] ? sumChecked ++ : null))
        
        return sumChecked / sum * 100
    }
    function getPercentage(bereich) {
        let sum = bereich['tätigkeiten'].length
        let sumChecked = 0
        bereich['tätigkeiten'].forEach((tätigkeit) => tätigkeit['checked'] ? sumChecked ++ : null)
        
        return sumChecked / sum * 100
    }
    function onChangedChecked(event, index, _index) {
        let _data = data
        _data['bereiche'][index]['tätigkeiten'][_index]['checked'] = event.target.checked
        _data['bereiche'][index]['strokeDashoffset'] = strokeDasharray(getPercentage(_data['bereiche'][index]));
        fetchDB(_data)
        setData({..._data})
        setLevel({...level})
    }
    function onChangeExpanded(index) {        
        let _data = data
        _data['bereiche'][index]['offen'] = !_data['bereiche'][index]['offen']
        fetchDB(_data)
        setData({..._data})
    }
    function isLevelAbsolved(atIndex) {
        let tätigkeiten = []
        data['bereiche'].forEach(bereich => tätigkeiten = tätigkeiten.concat(bereich['tätigkeiten']))
        return {..._level}['level'].filter((el, index) => atIndex >= index).every((_level) => {
            return _level['vorraussetzungen'].every(v => tätigkeiten.some(t => t['titel'] == v && t['checked']))
        })
    }
    function fetchDB(data) {
        fetch('/api/update', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ data: data, words: words })
        })
    }
    function getCurrentLevel() {
        let currentLevel = 0;
        level['level'].forEach((_level, index) => {
            if (isLevelAbsolved(index)) {
                currentLevel = index+1
            }
        })
        return currentLevel;
    }

    const level_list = useRef(null);

    function scrollMore(event) {
        event.preventDefault()
        level_list.current.scrollLeft = level_list.current.scrollLeft + 220;
    }

    return (
        <main>
            <h1>Zum Erwachsen werden ...</h1>
            <div className={styles.checklist_name}>
                <span className="material-symbols-outlined">account_circle</span>
                <p style={{ 'display': 'flex', 'gap': '4px', 'alignItems': 'center', 'justifyContent': 'center' }}>Checkliste von <span onClick={() => setShowPassword(!showPassword)} className={styles.passcode + " " + (showPassword ? styles.show : styles.hide)}><span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span><span dangerouslySetInnerHTML={{__html: showPassword ? words : Array.apply(null, {length: words.length}).map((char => "&middot;")).join('')}}></span></span>  <Link href="/"><a className={styles.link}>Ändern</a></Link></p>
            </div>
            <div className={styles.container}>
                <div className={styles.level_container}>
                    <h2>Level</h2>
                    <p>Du hast Level {getCurrentLevel()} erreicht.</p>
                    <div className={styles.level_list} ref={level_list}>
                        <div className={styles.level + " " + styles.start + " " + styles.top}>
                            <div className={styles.level_ball}>Start</div>
                        </div>
                        {level['level'].map((_level, _index) => 
                            <>
                                {<div className={styles.level + " " + (isLevelAbsolved(_index) ? styles.absolved : "")}>
                                    <svg width="401" height="271" viewBox="0 0 401 271">
                                        <path id="Pfad" fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" d="M 389 11 C 389 11 314.440674 3.591095 266 47 C 197.935989 107.993866 204.472717 184.775635 139 226 C 75.958435 265.693604 12 259 12 259 L 12 259"/>
                                    </svg>
                                </div>}
                                <div className={styles.level + " " + ((_index+1) % 2 == 0 ? styles.top : styles.bottom) + " " + (isLevelAbsolved(_index) ? styles.absolved : "")}>
                                    <div className={styles.level_ball}>
                                        <span>{_level['stufe']}</span>
                                        <div className={styles.annotation}>
                                            <span>{_level['name']}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.more} onClick={scrollMore}>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                </div>

                {data['bereiche'].map((bereich, index) => 
                    <div key={index}>
                        <div className={styles.line}>
                            <div className={styles.expand_icon + " " + (bereich['offen'] ? styles.expand_icon_open : "")} onClick={() => onChangeExpanded(index)}>
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                            <h1>{bereich['titel']}</h1>
                            <span>{Math.round(getPercentage(bereich))} %</span>
                            <svg width="30" height="30" style={{ 'marginRight': '6px' }}>
                                <circle r="10" cx="15" cy="15" fill="transparent" stroke="lightgrey" strokeWidth="4px" strokeDasharray={62.5} strokeDashoffset="0"></circle>
                                <circle r="10" cx="15" cy="15" fill="transparent" stroke="#216ec1" strokeWidth="4px" strokeDasharray={62.5} strokeDashoffset={bereich['strokeDashoffset'] ? bereich['strokeDashoffset'] : 0}></circle>
                            </svg>
                        </div>
                        <div className={styles.expand_content + " " + (bereich['offen'] ? styles.expand_open : "")}>
                            <hr/>
                            <ul>
                                {bereich['tätigkeiten'].map((tätigkeit, _index) => 
                                    <li key={_index}>
                                        <a>{tätigkeit['titel']}</a>
                                        <div className={styles.checkbox}>
                                            <input id={index + "-" + _index} onChange={(event) => onChangedChecked(event, index, _index)} defaultChecked={tätigkeit['checked']} type="checkbox"/><label htmlFor={index + "-" + _index}></label>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                <div className={styles.successes_container}>
                    <h2>Dein Ergebniss</h2>
                    <p></p>
                    <div className={styles.successes_list}>
                        <div className={styles.success}>
                            <svg width="50" height="50" style={{ 'marginRight': '6px' }}>
                                <circle r="22" cx="25" cy="25" fill="transparent" stroke="lightgrey" strokeWidth="5px" strokeDasharray={137} strokeDashoffset="0"></circle>
                                <circle r="22" cx="25" cy="25" fill="transparent" stroke="#216ec1" strokeWidth="5px" strokeDasharray={137} strokeDashoffset={strokeDasharray(getFullPercentage())}></circle>
                            </svg>
                            <span>{Math.round(getFullPercentage())} %</span>
                            <span>Gesamt</span>
                        </div>
                    </div>
                </div>

                <p>Deine Liste wird automatisch gespeichert. Um sie zu bearbeiten und später anzuschauen, merke dir den Namen, dem du ihr gegeben hast.</p>
            </div>
        </main>
    )
}

export async function getServerSideProps(context) {

    // Level laden
    const level = fs.readFileSync(process.cwd() + '/data/level.json', {encoding:'utf8'});

    let checklist= await prisma.checklist.findUnique({
        where: {
            words: context.params.words
        }
    })

    if (checklist == null) {

        const data = fs.readFileSync(process.cwd() + '/data/data.json', {encoding:'utf8'});

        await prisma.checklist.create({
            data: {
                words: context.params.words,
                json: data
            }
        })
    }

    checklist = await prisma.checklist.findUnique({
        where: {
            words: context.params.words
        }
    })

    return {
        props: {
            _data: JSON.parse(checklist['json']),
            _level: JSON.parse(level),
            words: context.params.words
        }
    }
}
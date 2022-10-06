import {useHttp} from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {selectAll} from '../heroesFilters/filtersSlice';
import store from '../../store';
import { addHero } from "../heroesList/heroesSlice";
import { v4 as uuidv4 } from 'uuid';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const dispatch = useDispatch();
    const {request} = useHttp();
    const filters = selectAll(store.getState());
    const {filtersLoadingStatus} = useSelector(state => state.filters);

    const [newHeroProps, setNewHeroProps] = useState({
        id: '',
        name: '',
        description: '',
        element: ''
    });


    const onSubmit = (e) => {
        e.preventDefault();
        const newHero = {
            ...newHeroProps,
            id: uuidv4() 
        }
        
        request(`http://localhost:3001/heroes`, "POST", JSON.stringify(newHero))
                    .then(data => console.log(data, 'Posted'))
                    .then(dispatch(addHero(newHero)))
                    .catch(err => console.log(err));
        setNewHeroProps({
            id: '',
            name: '',
            description: '',
            element: ''});
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form 
        className="border p-4 shadow-lg rounded"
        onSubmit={onSubmit}
        >
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={newHeroProps.name}
                    onChange={(e) => {
                        setNewHeroProps(oldState => ({
                            ...oldState,
                            name: e.target.value
                        }))
                    }}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={newHeroProps.description}
                    onChange={(e) => {
                        setNewHeroProps(oldState => ({
                            ...oldState,
                            description: e.target.value
                        }))
                    }}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={newHeroProps.element}
                    onChange={(e) => {
                        setNewHeroProps(oldState => ({
                            ...oldState,
                            element: e.target.value
                        }))
                    }}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;
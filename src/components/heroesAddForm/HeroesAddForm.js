import { useState } from 'react';
import { useSelector} from 'react-redux';
import {selectAll} from '../heroesFilters/filtersSlice';
import store from '../../store';
import { useCreateHeroMutation } from '../../api/apiSlice';
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

    const filters = selectAll(store.getState());
    const {filtersLoadingStatus} = useSelector(state => state.filters);

    const [createHero, {isLoading}] = useCreateHeroMutation();

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
        
        createHero(newHero).unwrap();

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
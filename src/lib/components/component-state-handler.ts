import { useState } from 'react'

export class ComponentStateHandler<TModel> {
    private readonly innerState: [TModel, React.Dispatch<React.SetStateAction<TModel>>]

    constructor (defaultValue: TModel) {
        this.innerState = useState<TModel>(defaultValue)
    }

    public get value () {
        return this.innerState[0]
    }

    public update (updatedValue: TModel) {
        this.innerState[1](updatedValue)
    }
}

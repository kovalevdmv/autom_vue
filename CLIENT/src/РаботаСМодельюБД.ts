
class ТипыКолонок {
    static readonly INTEGER: string = 'INTEGER';
    static readonly NUMERIC: string = 'NUMERIC';
    static NUMERIC_ТОЧНОСТЬ(ЦелаяЧасть: number, ДробнаяЧасть: number): string { return `NUMERIC(${ЦелаяЧасть},${ДробнаяЧасть})` };
    static readonly TEXT: string  = 'TEXT';
}

enum ДействияПриИзмененииГлавнойВнешнейТаблицы {
    НетДействия = "NO ACTION",
    Ограничивать = "RESTRICT",
}

interface ДанныеВнешнегоКлюча {
    ПризнакВнешнегоКлюча: boolean,
    ВнешняяТаблица: ТаблицаВБД | undefined,
    КлючВнешнейТаблицы: string,
    ДействиеПриОбновлении: ДействияПриИзмененииГлавнойВнешнейТаблицы,
    ДействиеПриУдалении: ДействияПриИзмененииГлавнойВнешнейТаблицы,
    ДействиеССуществующимиЗаписями: string,
}

class Колонка {

    private _Тип: ТипыКолонок = '';
    private _Имя = '';
    private _ПризнакНеNull = false;
    private _ЗначениеПоУмолчанию: string | number | null = null;
    private _ПризнакЭтоПервичныйКлюч = false;
    private _ДанныеВнешнегоКлюча: ДанныеВнешнегоКлюча = {
        ПризнакВнешнегоКлюча: false,
        ВнешняяТаблица: undefined,
        КлючВнешнейТаблицы: '',
        ДействиеПриОбновлении: ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,
        ДействиеПриУдалении: ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,
        ДействиеССуществующимиЗаписями: "NOT VALID",
    }
    private _АвтоИнкремент: boolean = false;
    private _Индексируется: boolean = false;

    Индексируется(Признак: boolean = true) {
        this._Индексируется = Признак;
        return this;
    }

    ПолучитьЗначенияПолей() {
        return { Тип: this._Тип, Имя: this._Имя, ПризнакНеNull: this._ПризнакНеNull, ЗначениеПоУмолчанию: this._ЗначениеПоУмолчанию, ПризнакЭтоПервичныйКлюч: this._ПризнакЭтоПервичныйКлюч, ДанныеВнешнегоКлюча: this._ДанныеВнешнегоКлюча, АвтоИнкремент: this._АвтоИнкремент, Индексируется: this._Индексируется };
    }

    constructor(Имя: string) {
        this._Имя = Имя;
    }

    Тип(Тип: ТипыКолонок) {
        this._Тип = Тип;

        return this;
    }

    НеNull(Признак: boolean = true) {
        this._ПризнакНеNull = Признак;
        return this;
    }

    ПоУмолчанию(ЗначениеПоУмолчанию: string | number | null) {
        this._ЗначениеПоУмолчанию = ЗначениеПоУмолчанию;
        return this;
    }

    АвтоИнкремент(Признак: boolean = true) {
        this._АвтоИнкремент = Признак;
        return this;
    }

    ЭтоПервичныйКлюч(ЭтоПервичныйКлюч = true) {
        this._ПризнакЭтоПервичныйКлюч = ЭтоПервичныйКлюч;
        return this;
    }

    ЭтоВнешнийКлюч(
        ЭтоВнешнийКлюч = true,
        ВнешняяТаблица: ТаблицаВБД | undefined,
        КлючВнешнейТаблицы = '',
        ДействиеПриОбновленииЗаписейВнешнейТаблицы = ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,
        ДействиеПриУдаленииЗаписейВнешнейТаблицы = ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,
        ДействиеССуществующимиЗаписями = "NOT VALID"
    ) {
        this._ДанныеВнешнегоКлюча.ПризнакВнешнегоКлюча = ЭтоВнешнийКлюч;
        this._ДанныеВнешнегоКлюча.ВнешняяТаблица = ВнешняяТаблица;
        this._ДанныеВнешнегоКлюча.КлючВнешнейТаблицы = КлючВнешнейТаблицы;
        this._ДанныеВнешнегоКлюча.ДействиеПриОбновлении = ДействиеПриОбновленииЗаписейВнешнейТаблицы;
        this._ДанныеВнешнегоКлюча.ДействиеПриУдалении = ДействиеПриУдаленииЗаписейВнешнейТаблицы;
        this._ДанныеВнешнегоКлюча.ДействиеССуществующимиЗаписями = ДействиеССуществующимиЗаписями;
        return this;
    }
}

class ТаблицаВБД {

    Имя = '';
    private Колонки: Колонка[];
    private _Владелец = 'postgres';
    private _Схема = 'public';

    constructor(Имя: string, Схема: string = 'public', Владелец: string = 'postgres') {
        this.Имя = Имя;
        this._Схема = Схема;
        this._Владелец = Владелец;
        this.Колонки = [];
    }

    ДобавитьКолонку(Имя: string) {
        const НоваяКолонка = new Колонка(Имя);
        this.Колонки.push(НоваяКолонка);
        return НоваяКолонка;
    }

    private СледующееЗначениеВПоследовательности(ИмяКолонки: string) {
        return `nextval('${this.Имя}_${ИмяКолонки}_seq'::regclass)`;
    }

    /*
    DO $$
BEGIN
    -- Проверяем, существует ли колонка 'new_column' в таблице 'analoguesofnomenclature'
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'analoguesofnomenclature' 
        AND column_name = 'new_column2'
    ) THEN
        -- Добавляем колонку, если она не существует
        ALTER TABLE public.analoguesofnomenclature ADD COLUMN new_column2 VARCHAR(255);
    END IF;
END$$;
*/

    ТестЗапросаНаСоздание() {

        let Текст = '';
        const ПоследовательностиДляСоздания: string[] = [];
        const ИндексыДляСоздания: string[] = [];

        Текст += `CREATE TABLE IF NOT EXISTS ${this._Схема}.${this.Имя}( `;

        for (let текКолонка of this.Колонки) {
            const ЗначенияПолей = текКолонка.ПолучитьЗначенияПолей();
            Текст += `${ЗначенияПолей.Имя} ${ЗначенияПолей.Тип} ${ЗначенияПолей.ПризнакНеNull ? 'NOT NULL' : ''} ${ЗначенияПолей.ЗначениеПоУмолчанию ? ' DEFAULT ' + ЗначенияПолей.ЗначениеПоУмолчанию : ''} ${ЗначенияПолей.АвтоИнкремент ? ' DEFAULT ' + this.СледующееЗначениеВПоследовательности(ЗначенияПолей.Имя) : ''},`;
            Текст += ЗначенияПолей.ПризнакЭтоПервичныйКлюч ? `CONSTRAINT ${this.Имя}_pkey PRIMARY KEY (${ЗначенияПолей.Имя}),` : '';
            if (ЗначенияПолей.ДанныеВнешнегоКлюча.ПризнакВнешнегоКлюча) {
                Текст += `CONSTRAINT ${this.Имя}_${ЗначенияПолей.Имя}_fkey FOREIGN KEY (${ЗначенияПолей.Имя})`;
                Текст += `REFERENCES ${this._Схема}.${ЗначенияПолей.ДанныеВнешнегоКлюча.ВнешняяТаблица?.Имя} (${ЗначенияПолей.ДанныеВнешнегоКлюча.КлючВнешнейТаблицы}) MATCH SIMPLE `;
                Текст += `ON UPDATE ${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеПриОбновлении} `;
                Текст += `ON DELETE ${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеПриУдалении} `;
                Текст += `${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеССуществующимиЗаписями},`;
            }
            if (ЗначенияПолей.АвтоИнкремент) {
                const Последовательность = `${this._Схема}.${this.Имя}_${ЗначенияПолей.Имя}_seq`;
                ПоследовательностиДляСоздания.push(`CREATE SEQUENCE IF NOT EXISTS ${Последовательность}; `);
            }

            if (ЗначенияПолей.Индексируется)
                ИндексыДляСоздания.push(`CREATE INDEX IF NOT EXISTS idx_${this.Имя}_${ЗначенияПолей.Имя} ON ${this.Имя} (${ЗначенияПолей.Имя});`);
        }

        Текст = Текст.slice(0, -1);

        Текст += ');';

        Текст += this._Владелец ? `ALTER TABLE IF EXISTS ${this._Схема}.${this.Имя} OWNER to ${this._Владелец};` : '';

        Текст += ИндексыДляСоздания.join(' ');

        Текст = ПоследовательностиДляСоздания.join(' ') + Текст;
        

        return Текст;

    }

}

export { ТипыКолонок, ДействияПриИзмененииГлавнойВнешнейТаблицы, ТаблицаВБД };
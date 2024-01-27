
class ТипыКолонок {
    static readonly INTEGER: string = 'INTEGER';
    static readonly NUMERIC: string = 'NUMERIC';
    static NUMERIC_ТОЧНОСТЬ(ЦелаяЧасть: number, ДробнаяЧасть: number): string { return `NUMERIC(${ЦелаяЧасть},${ДробнаяЧасть})` };
    static readonly TEXT: string = 'TEXT';
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

    private ДобавитьПолеЕслиНеСуществует(ЗначенияПолей) {
        return `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = '${this._Схема}'
                AND table_name = '${this.Имя}' 
                AND column_name = '${ЗначенияПолей.Имя}'
            ) THEN
                ALTER TABLE ${this._Схема}.${this.Имя} ADD COLUMN ${ЗначенияПолей.Имя} ${ЗначенияПолей.Тип} ${ЗначенияПолей.ПризнакНеNull ? 'NOT NULL' : ''} ${ЗначенияПолей.ЗначениеПоУмолчанию ? ' DEFAULT ' + ЗначенияПолей.ЗначениеПоУмолчанию : ''} ${ЗначенияПолей.АвтоИнкремент ? ' DEFAULT ' + this.СледующееЗначениеВПоследовательности(ЗначенияПолей.Имя) : ''};
            END IF;
        END$$;
        `;
    }

    /**
     * 
     * @param Ограничение - ТипыКлючей
     * @returns 
     */
    private ДобавитьОграничениеЕслиНеСуществует(ЗначенияПолей) {
        let ПостфиксОграничения = '';
        let Ограничение = '';
        if (ЗначенияПолей.ПризнакЭтоПервичныйКлюч) {
            ПостфиксОграничения = 'pkey';
            Ограничение = 'PRIMARY KEY';
        }
        else if (ЗначенияПолей.ДанныеВнешнегоКлюча.ПризнакВнешнегоКлюча) {
            ПостфиксОграничения = 'fkey';
            Ограничение = 'FOREIGN KEY';
        }
        if (!ПостфиксОграничения)
            return '';

        const ИмяОграничения = `${this.Имя}_${ЗначенияПолей.Имя}_${ПостфиксОграничения}`;

        let ТекстДляЗапроса = ЗначенияПолей.ПризнакЭтоПервичныйКлюч ? `CONSTRAINT ${ИмяОграничения} PRIMARY KEY (${ЗначенияПолей.Имя})` : '';

        if (ЗначенияПолей.ДанныеВнешнегоКлюча.ПризнакВнешнегоКлюча) {
            ТекстДляЗапроса += `CONSTRAINT ${ИмяОграничения} FOREIGN KEY (${ЗначенияПолей.Имя})`;
            ТекстДляЗапроса += `REFERENCES ${this._Схема}.${ЗначенияПолей.ДанныеВнешнегоКлюча.ВнешняяТаблица?.Имя} (${ЗначенияПолей.ДанныеВнешнегоКлюча.КлючВнешнейТаблицы}) MATCH SIMPLE `;
            ТекстДляЗапроса += `ON UPDATE ${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеПриОбновлении} `;
            ТекстДляЗапроса += `ON DELETE ${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеПриУдалении} `;
            ТекстДляЗапроса += `${ЗначенияПолей.ДанныеВнешнегоКлюча.ДействиеССуществующимиЗаписями}`;
        }

        return `
        DO $$
    BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = '${this._Схема}'
          AND table_name = '${this.Имя}'
          AND constraint_type = '${Ограничение}'
          AND constraint_name = '${ИмяОграничения}'
    ) THEN
        ALTER TABLE ${this._Схема}.${this.Имя} ADD ${ТекстДляЗапроса};
    END IF;
    END$$;
        `;
    }

    ТестЗапросаНаСоздание() {

        let Текст = '';
        const ПоследовательностиДляСоздания: string[] = [];
        const ИндексыДляСоздания: string[] = [];

        Текст += `CREATE TABLE IF NOT EXISTS ${this._Схема}.${this.Имя}( );`;

        for (let текКолонка of this.Колонки) {
            const ЗначенияПолей = текКолонка.ПолучитьЗначенияПолей();
            Текст += this.ДобавитьПолеЕслиНеСуществует(ЗначенияПолей);
            Текст += this.ДобавитьОграничениеЕслиНеСуществует(ЗначенияПолей);
            if (ЗначенияПолей.АвтоИнкремент) {
                const Последовательность = `${this._Схема}.${this.Имя}_${ЗначенияПолей.Имя}_seq`;
                ПоследовательностиДляСоздания.push(`CREATE SEQUENCE IF NOT EXISTS ${Последовательность}; `);
            }

            if (ЗначенияПолей.Индексируется)
                ИндексыДляСоздания.push(`CREATE INDEX IF NOT EXISTS idx_${this.Имя}_${ЗначенияПолей.Имя} ON ${this.Имя} (${ЗначенияПолей.Имя});`);
        }

        Текст = Текст.slice(0, -1);

        Текст += this._Владелец ? `ALTER TABLE IF EXISTS ${this._Схема}.${this.Имя} OWNER to ${this._Владелец};` : '';

        Текст += ИндексыДляСоздания.join(' ');

        Текст = ПоследовательностиДляСоздания.join(' ') + Текст;

        return Текст;

    }

}

export { ТипыКолонок, ДействияПриИзмененииГлавнойВнешнейТаблицы, ТаблицаВБД };
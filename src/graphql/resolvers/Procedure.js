/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
export default {
  Query: {
    procedures: async (parent, { type, offset, pageSize }, { ProcedureModel }) => {
      let currentStates = [];
      switch (type) {
        case 'PREPARATION':
          currentStates = [
            'Dem Bundesrat zugeleitet - Noch nicht beraten',
            'Dem Bundestag zugeleitet - Noch nicht beraten',
            'Den Ausschüssen zugewiesen',
            'Einbringung abgelehnt',
            '1. Durchgang im Bundesrat abgeschlossen',
            'Überwiesen',
            'Noch nicht beraten',
            'Keine parlamentarische Behandlung',
            'Nicht abgeschlossen - Einzelheiten siehe Vorgangsablauf',
          ];
          break;
        case 'VOTING':
          currentStates = [
            'Beschlussempfehlung liegt vor',
            // Unterhalb keys für Vergangen
            'Erledigt durch Ablauf der Wahlperiode',
            'Zurückgezogen',
            'Abgeschlossen - Ergebnis siehe Vorgangsablauf',
            'Für nichtig erklärt',
            'Verkündet',
            'Zusammengeführt mit... (siehe Vorgangsablauf)',
            'Für erledigt erklärt',
            'Verabschiedet',
            'Bundesrat hat zugestimmt',
            'Bundesrat hat Einspruch eingelegt',
            'Bundesrat hat Zustimmung versagt',
            'Bundesrat hat Vermittlungsausschuss nicht angerufen',
            'Im Vermittlungsverfahren',
            'Vermittlungsvorschlag liegt vor',
            'Für mit dem Grundgesetz unvereinbar erklärt',
            'Nicht ausgefertigt wegen Zustimmungsverweigerung des Bundespräsidenten',
            'Zustimmung versagt',
            'Teile des Gesetzes für nichtig erklärt',
            'Für gegenstandslos erklärt',
          ];
          break;
        case 'HOT':
          currentStates = [];
          break;

        default:
          break;
      }

      let period = { $gte: 19 };
      let sort = { voteDate: -1 };
      if (type === 'PREPARATION') {
        period = { $gte: 19 };
        sort = { lastUpdateDate: -1 };
        return ProcedureModel.find({ currentStatus: { $in: currentStates }, period })
          .sort(sort)
          .skip(offset)
          .limit(pageSize);
      }

      const activeVotings = await ProcedureModel.find({
        voteDate: { $exists: false },
        currentStatus: { $in: currentStates },
        period,
      })
        .sort({ lastUpdateDate: -1 })
        .skip(offset)
        .limit(pageSize);

      return ProcedureModel.find({
        voteDate: { $exists: true },
        currentStatus: { $in: currentStates },
        period,
      })
        .sort(sort)
        .skip(offset - activeVotings.length > 0 ? offset - activeVotings.length : 0)
        .limit(pageSize - activeVotings.length)
        .then(finishedVotings => [...activeVotings, ...finishedVotings]);
    },
    procedure: async (parent, { id }, { ProcedureModel }) =>
      ProcedureModel.findOne({ procedureId: id }),
    searchProcedures: (parent, { term }, { ProcedureModel }) =>
      ProcedureModel.find(
        { $text: { $search: term }, period: 19 },
        { score: { $meta: 'textScore' } },
      ).sort({ score: { $meta: 'textScore' } }),
  },
};

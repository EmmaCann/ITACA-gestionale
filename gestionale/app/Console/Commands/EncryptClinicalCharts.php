<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CartellaClinica;
use Illuminate\Support\Facades\Crypt;

class EncryptClinicalCharts extends Command
{
    protected $signature = 'clinical:encrypt';
    protected $description = 'Encrypt existing clinical chart fields that are still in plaintext';

    public function handle()
    {
        $count = 0;

        CartellaClinica::query()->chunkById(200, function ($rows) use (&$count) {
            foreach ($rows as $c) {

                // leggiamo i valori RAW dal DB (senza decrypt)
                $rawAnamnesi = $c->getRawOriginal('anamnesi');
                $rawDiagnosi = $c->getRawOriginal('diagnosi');
                $rawTerapia  = $c->getRawOriginal('terapia');
                $rawNote     = $c->getRawOriginal('note');

                // funzione: prova a capire se è già cifrato
                $encryptIfPlain = function ($raw) {
                    if ($raw === null || $raw === '') return $raw;

                    // se è già un payload Laravel valido, non toccare
                    try {
                        Crypt::decrypt($raw);
                        return $raw; // già cifrato
                    } catch (\Throwable $e) {
                        return Crypt::encrypt($raw); // era in chiaro -> cifro
                    }
                };

                $new = [
                    'anamnesi' => $encryptIfPlain($rawAnamnesi),
                    'diagnosi' => $encryptIfPlain($rawDiagnosi),
                    'terapia'  => $encryptIfPlain($rawTerapia),
                    'note'     => $encryptIfPlain($rawNote),
                ];

                // update RAW (bypass cast) per evitare decrypt automatico
                CartellaClinica::where('id', $c->id)->update($new);

                $count++;
            }
        });

        $this->info("Done. Processed rows: {$count}");
        return Command::SUCCESS;
    }
}

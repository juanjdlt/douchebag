<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('DoucheJarTableSeeder');
		$this->command->info('DoucheJar table seeded!');
	}
}

class DoucheJarTableSeeder extends Seeder
{
	
	public function run()
	{
		DB::table('douchejar')->delete();
		Douchejar::create(array('name' => 'Bad Words', 'description' => 'When someone says %$#@', 'multiplier' => 1));
	}
}

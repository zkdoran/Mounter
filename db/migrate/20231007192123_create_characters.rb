class CreateCharacters < ActiveRecord::Migration[6.1]
  def change
    create_table :characters do |t|
      t.string :name
      t.string :region
      t.string :realm

      t.timestamps
    end
  end
end

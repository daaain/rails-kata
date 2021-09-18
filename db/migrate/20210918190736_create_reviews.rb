class CreateReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :reviews do |t|
      t.integer :rating
      t.text :content
      t.column :product_id, :integer

      t.timestamps
    end
  end
end

function mySettings(props) {
  return (
    <Page>
       <Section description={<Text>NOTE: Please keep the to-do entry text length small as you can only see limited amount of text in the app. Enter up to 50 to do entries.</Text>} title={<Text>To Do List</Text>}>

        <AdditiveList
          settingsKey="todo_items"
          maxItems="50"
          addAction={
            <TextInput
              label="Add a to do entry"
              placeholder="To do entry"
              action="Add"
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);

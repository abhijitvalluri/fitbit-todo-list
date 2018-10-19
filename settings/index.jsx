function mySettings(props) {
  return (
    <Page>
      <Section title={<Text>Watch Settings</Text>}>
        <Text>You can choose the color scheme for the list on the watch.</Text>
        <ColorSelect
          settingsKey="color_scheme_name"
          colors={[
            { color: 'sandybrown' },
            { color: 'tomato' },
            { color: 'orangered' },
            { color: 'gold' },
            { color: 'white' },
            { color: 'black' },
            { color: 'plum' },
            { color: 'mediumvioletred' },
            { color: 'purple' },
            { color: 'deepskyblue' },
            { color: 'dodgerblue' },
            { color: 'midnightblue' }
          ]}
        />
      </Section>
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
